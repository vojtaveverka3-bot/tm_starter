
/**
 * „model“ je jen popis tvaru dat, se kterými aplikace pracuje, plus pár funkcí, jak s těmito daty zacházet.
 *
 * Jednoduchý "model" účtu – zatím v paměti, aby šlo rychle začít.
 * Tvar dat odpovídá OpenAPI: Account
 */
import crypto from 'crypto'; //toto se používá jen na generování náhodného ID pro uživatele

const _mem = new Map();

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
export const Accounts = {
    create(data) {
    const accountId = `acc_${crypto.randomUUID()}`;
    const createdAt = new Date().toISOString();

    //zde se vytvoří pomocná proměnná pro nový účet a nahrají se do ní potřebná data
    const item = {
      accountId,
      userId: data.userId,
      institutionId: data.institutionId,
      accountNumber: data.accountNumber || '000000-0000000000/0100',
      name: data.name || 'Můj účet',
      currency: data.currency,
      balance: data.balance ?? 0,
      isActive: true,
      createdAt
    };

    //zde se přidá vytvořený item do kolekce (do mapy)
    _mem.set(accountId, item);
    return item;
  },
  update({ accountId, ...rest }) {
    const curr = _mem.get(accountId);
    if (!curr) return null;

    //rozbalení objektu v JS
    //Vytvoří nový objekt.
      // Do něj zkopíruje vlastnosti z curr.
      // Pak do něj zkopíruje vlastnosti z rest a přepíše jimi stejné klíče z curr (co je vpravo, to vyhrává - má přednost).
    const updated = { ...curr, ...rest };
    //následně se aktualizuje
    _mem.set(accountId, updated);
    return updated;
  },
  close(accountId, closeDate) {
    const curr = _mem.get(accountId);
    if (!curr) return null;
    curr.isActive = false;
    curr.closeDate = closeDate || new Date().toISOString().slice(0,10);
    _mem.set(accountId, curr);
    return curr;
  },
  findByIdForUser(accountId, userId) {
    const a = _mem.get(accountId);
    if (!a) return null;
    if (userId && a.userId !== userId) return null;
    return a;
  },
  listByUser(userId, { page = 1, pageSize = 50 } = {}) {
    const all = [..._mem.values()].filter(a => !userId || a.userId === userId);
    const start = (page - 1) * pageSize;
    return all.slice(start, start + pageSize);
  }
};
