// APLIKASI RESERVASI TIKET KONSER
// PROJECT UAS SEMESTER 1
import * as readline from 'readline';

// TIPE DATA  DAN KONSTANTA
type Kategori= "VIP" | "FESTIVAL" | "REGULER"

interface Reservasi {
  id: string;
  namaPemesan: string;
  kategoriTiket: Kategori;
  jumlahTiket: number;
  hargaSatuan: number;
  totalBayar: number;
  sudahDibayar: boolean;
}

const HARGA_VIP = 300000;
const HARGA_FESTIVAL = 200000;
const HARGA_REGULER = 100000;
const BATAS_DISKON_ROMBONGAN = 5;
const PERSEN_DISKON = 10;
<<<<<<< HEAD
const daftarReservasi: Reservasi[] = [];
let nomorBerikutnya: number = 1;

// ----- Pembaca input dari terminal -----


const antreanInput: string[] = [];
let penungguInput: ((teks: string) => void) | null = null;
let inputSelesai: boolean = false;
const pembaca = readline.createInterface({ input: process.stdin });

pembaca.on("line", (baris: string): void => {
  if (penungguInput !== null) {
    const kirim = penungguInput;
    penungguInput = null;
    kirim(baris);
  } else {
    antreanInput.push(baris);
  }
});

pembaca.on("close", (): void => {
  inputSelesai = true;
  if (penungguInput !== null) {
    console.log("\nInput ditutup. Program dihentikan.");
    process.exit(0);
  }
});


function tanya(pertanyaan: string): Promise<string> {
  process.stdout.write(pertanyaan);
  return new Promise<string>((selesai: (teks: string) => void): void => {
    if (antreanInput.length > 0) {
      selesai(antreanInput.shift() as string);
    } else if (inputSelesai) {
      console.log("\nInput ditutup. Program dihentikan.");
      process.exit(0);
    } else {
      penungguInput = selesai;
    }
  });
}

// ----- Fungsi bantu dasar -----

function tampilkanGaris(): void {
  console.log("=".repeat(80));
}

function formatRupiah(angka: number): string {
  if (angka === 0) {
    return "Rp 0";
  }
  let sisa: number = Math.abs(angka); 
  let hasil: string = ""; 
  while (sisa > 0) {
    const tigaDigit: number = sisa % 1000; 
    sisa = Math.floor(sisa / 1000); 
    if (sisa > 0) {
      hasil = "." + String(tigaDigit).padStart(3, "0") + hasil;
    } else {
      hasil = String(tigaDigit) + hasil;
    }
  }
  return "Rp " + hasil;
}

function hargaPerKategori(kategori: Kategori): number {
  let harga: number;
  switch (kategori) {
    case "VIP":
      harga = HARGA_VIP;
      break;
    case "FESTIVAL":
      harga = HARGA_FESTIVAL;
      break;
    case "REGULER":
      harga = HARGA_REGULER;
      break;
    default:
      harga = 0; 
      break;
  }
  return harga;
}

function hitungTotalBayar(harga: number, jumlah: number): number {
  let total: number = harga * jumlah; 
  if (harga > 0 && jumlah >= BATAS_DISKON_ROMBONGAN) {
    let potongan: number = total; 
    potongan *= PERSEN_DISKON; 
    potongan /= 100; 
    total -= potongan;
  }
  return total;
}

function cariIndeksById(id: string): number {
  const idBersih: string = id.trim().toUpperCase(); // samakan huruf besar
  return daftarReservasi.findIndex((r: Reservasi): boolean => r.id === idBersih);
}


function buatIdUnik(): string {
  let id: string;
  do {
    id = "RSV-" + String(nomorBerikutnya).padStart(3, "0");
    nomorBerikutnya++;
  } while (cariIndeksById(id) !== -1);
  return id;
}

// DATA AWAL
function muatDataAwal(): void {
  // Setiap baris: [nama pemesan, nama konser, kategori, jumlah, sudah dibayar]
  const dataAwal: [string, string, Kategori, number, boolean][] = [
    ["Raykhan", "Cooltura", "VIP", 2, true],
    ["Sahid", "Cooltura", "FESTIVAL", 5, true],
    ["Fizri", "Pestapora", "REGULER", 3, false],
    ["Hafizh", "Pestapora", "VIP", 1, true],
    ["Nnael", "Dprfestival", "FESTIVAL", 6, false],
  ];
  
  for (const [nama, konser, kategori, jumlah, lunas] of dataAwal) {
    const harga: number = hargaPerKategori(kategori);
    if (jumlah < 1 || harga === 0) {
      console.log("[!] Data awal untuk " + nama + " dilewati karena tidak valid.");
      continue;
    }
    daftarReservasi.push({
      id: buatIdUnik(),
      namaPemesan: nama,
      namaKonser: konser,
      kategoriTiket: kategori,
      jumlahTiket: jumlah,
      hargaSatuan: harga,
      totalBayar: hitungTotalBayar(harga, jumlah),
      sudahDibayar: lunas,
    });
  }
}

/** Mencetak daftar pilihan menu utama. */
function tampilkanMenu(): void {
  console.log("\n");
  tampilkanGaris();
  console.log("   RESERVASI TIKET KONSER");
  tampilkanGaris();
  console.log("   1. Tambah reservasi");
  console.log("   2. Tampilkan semua reservasi");
  console.log("   3. Lihat detail reservasi (berdasarkan ID)");
  console.log("   4. Ubah reservasi");
  console.log("   5. Hapus reservasi");
  console.log("   6. Cari reservasi");
  console.log("   0. Keluar");
  tampilkanGaris();
  
  console.log(
    "Harga: VIP " + formatRupiah(HARGA_VIP) + " | Festival " + formatRupiah(HARGA_FESTIVAL) +
      " | Tribun " + formatRupiah(HARGA_REGULER)
  );
  console.log("Diskon rombongan " + PERSEN_DISKON + "% untuk pembelian " + BATAS_DISKON_ROMBONGAN + " tiket atau lebih.");
}


async function jalankanMenu(): Promise<void> {
  let selesai: boolean = false; 
  while (!selesai) {
    tampilkanMenu();
    const pilihan: string = (await tanya("Pilih menu [0-6]: ")).trim();
    
    switch (pilihan) {
      case "1":
        fiturBelumTersedia("Create (tambah reservasi)");
        break;
      case "2":
        fiturBelumTersedia("Read (tampilkan semua reservasi)");
        break;
      case "3":
        fiturBelumTersedia("Read (detail reservasi)");
        break;
      case "4":
        fiturBelumTersedia("Update (ubah reservasi)");
        break;
      case "5":
        fiturBelumTersedia("Delete (hapus reservasi)");
        break;
      case "6":
        fiturBelumTersedia("Search (cari reservasi)");
        break;
      case "0":
        selesai = true; 
        console.log("\nTerima kasih telah menggunakan aplikasi ini.");
        break;
      default:
        console.log("[!] Pilihan tidak valid. Masukkan angka 0 sampai 6.");
        break;
    }
  }
  pembaca.close(); 
}

function fiturBelumTersedia(namaFitur: string): void {
  console.log("[i] Fitur " + namaFitur + " belum tersedia pada tahap ini.");
}

muatDataAwal(); 
jalankanMenu(); 
