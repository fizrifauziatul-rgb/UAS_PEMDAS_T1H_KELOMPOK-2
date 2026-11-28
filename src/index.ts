// APLIKASI RESERVASI TIKET KONSER
// PROJECT UAS SEMESTER 1
import * as readline from 'readline';

// TIPE DATA  DAN KONSTANTA
type Kategori= "VIP" | "FESTIVAL" | "REGULER"

interface Reservasi {
  namaKonser: string;
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
