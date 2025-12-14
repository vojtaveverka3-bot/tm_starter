
/**
 * Servisa = „mozkovna“ (aplikační logika).
 * Neřeší HTTP. Dělá výpočty a rozhodnutí: ověří, jestli účet patří uživateli, spočítá zůstatek, uloží/načte data, spustí převod atd.
 * Vrací výsledek controlleru.
 *
 *
 * Tady bude "aplikační logika". Zatím pracujeme s pamětí,
 * později se to napojí na skutečnou databázi.
 */
import { Accounts } from '../models/accounts.js';

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
//Normální funkce vrací hodnotu hned.
//Async funkce vrací Promise (slib), protože dělá něco „na pozadí“ (čeká na síť/DB/časovač).
//Pokud chceme počkat na výsledek, musíme tam, kde funkci voláme použít před konkrétní funkcí klíčové slovo await
export async function getAccountById(accountId, user) {
  return Accounts.findByIdForUser(accountId, user?.id);
}

export async function listAccounts({ userId, page, pageSize }, user) {
  const effectiveUser = userId || user?.id;
  const items = Accounts.listByUser(effectiveUser, { page, pageSize });
  return { items, total: items.length, page, pageSize };
}

export async function createAccount(body, user) {
  return Accounts.create({ ...body, balance: 0, isActive: true });
}

export async function updateAccount(body, user) {
  return Accounts.update(body);
}

export async function closeAccount({ accountId, closeDate }, user) {
  return Accounts.close(accountId, closeDate);
}

export async function getBalance(accountId, user) {
  const acc = await Accounts.findByIdForUser(accountId, user?.id);
  if (!acc) return null;
  return { accountId: acc.accountId, balance: acc.balance, currency: acc.currency };
}

export async function getHistory({ accountId }, user) {
  // Pro demo vracíme prázdný seznam
  return { items: [], total: 0, page: 1, pageSize: 50 };
}
