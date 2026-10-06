import { basvuruIsle } from "@/lib/basvuru-isle";
import { neonDepo } from "@/lib/depo";

// Yalnız POST tanımlı; diğer yöntemlere Next.js 405 döndürür.
export async function POST(istek: Request) {
  return basvuruIsle(istek, neonDepo);
}
