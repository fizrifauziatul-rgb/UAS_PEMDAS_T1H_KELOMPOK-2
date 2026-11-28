"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
// APLIKASI RESERVASI TIKET KONSER
// PROJECT UAS SEMESTER 1
const readline = __importStar(require("readline"));
const HARGA_VIP = 300000;
const HARGA_FESTIVAL = 200000;
const HARGA_REGULER = 100000;
const BATAS_DISKON_ROMBONGAN = 5;
const PERSEN_DISKON = 10;
const daftarReservasi = [];
let nomorBerikutnya = 1;
// ----- Pembaca input dari terminal -----
const antreanInput = [];
let penungguInput = null;
let inputSelesai = false;
const pembaca = readline.createInterface({ input: process.stdin });
pembaca.on("line", (baris) => {
    if (penungguInput !== null) {
        const kirim = penungguInput;
        penungguInput = null;
        kirim(baris);
    }
    else {
        antreanInput.push(baris);
    }
});
pembaca.on("close", () => {
    inputSelesai = true;
    if (penungguInput !== null) {
        console.log("\nInput ditutup. Program dihentikan.");
        process.exit(0);
    }
});
function tanya(pertanyaan) {
    process.stdout.write(pertanyaan);
    return new Promise((selesai) => {
        if (antreanInput.length > 0) {
            selesai(antreanInput.shift());
        }
        else if (inputSelesai) {
            console.log("\nInput ditutup. Program dihentikan.");
            process.exit(0);
        }
        else {
            penungguInput = selesai;
        }
    });
}
// ----- Fungsi bantu dasar -----
function tampilkanGaris() {
    console.log("=".repeat(80));
}
function formatRupiah(angka) {
    if (angka === 0) {
        return "Rp 0";
    }
    let sisa = Math.abs(angka);
    let hasil = "";
    while (sisa > 0) {
        const tigaDigit = sisa % 1000;
        sisa = Math.floor(sisa / 1000);
        if (sisa > 0) {
            hasil = "." + String(tigaDigit).padStart(3, "0") + hasil;
        }
        else {
            hasil = String(tigaDigit) + hasil;
        }
    }
    return "Rp " + hasil;
}
function hargaPerKategori(kategori) {
    let harga;
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
function hitungTotalBayar(harga, jumlah) {
    let total = harga * jumlah;
    if (harga > 0 && jumlah >= BATAS_DISKON_ROMBONGAN) {
        let potongan = total;
        potongan *= PERSEN_DISKON;
        potongan /= 100;
        total -= potongan;
    }
    return total;
}
function cariIndeksById(id) {
    const idBersih = id.trim().toUpperCase(); // samakan huruf besar
    return daftarReservasi.findIndex((r) => r.id === idBersih);
}
function buatIdUnik() {
    let id;
    do {
        id = "RSV-" + String(nomorBerikutnya).padStart(3, "0");
        nomorBerikutnya++;
    } while (cariIndeksById(id) !== -1);
    return id;
}
// DATA AWAL
function muatDataAwal() {
    // Setiap baris: [nama pemesan, nama konser, kategori, jumlah, sudah dibayar]
    const dataAwal = [
        ["Raykhan", "Cooltura", "VIP", 2, true],
        ["Sahid", "Cooltura", "FESTIVAL", 5, true],
        ["Fizri", "Pestapora", "REGULER", 3, false],
        ["Hafizh", "Pestapora", "VIP", 1, true],
        ["Nnael", "Dprfestival", "FESTIVAL", 6, false],
    ];
    for (const [nama, konser, kategori, jumlah, lunas] of dataAwal) {
        const harga = hargaPerKategori(kategori);
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
function tampilkanMenu() {
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
    console.log("Harga: VIP " + formatRupiah(HARGA_VIP) + " | Festival " + formatRupiah(HARGA_FESTIVAL) +
        " | Tribun " + formatRupiah(HARGA_REGULER));
    console.log("Diskon rombongan " + PERSEN_DISKON + "% untuk pembelian " + BATAS_DISKON_ROMBONGAN + " tiket atau lebih.");
}
async function jalankanMenu() {
    let selesai = false;
    while (!selesai) {
        tampilkanMenu();
        const pilihan = (await tanya("Pilih menu [0-6]: ")).trim();
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
function fiturBelumTersedia(namaFitur) {
    console.log("[i] Fitur " + namaFitur + " belum tersedia pada tahap ini.");
}
muatDataAwal();
jalankanMenu();
//# sourceMappingURL=index.js.map