/**
 * Controller = „přední dveře“ tvého API.
 * Bere HTTP požadavek (URL, parametry, tělo, hlavičky), zkontroluje vstupy, zavolá správnou servisu a vrátí HTTP odpověď (status kód + JSON).
 * Řeší jen věci kolem webu: validace vstupů, výběr status kódu, formátování odpovědi.
**/

import * as AccountsService from '../services/accountsService.js';
import { z } from 'zod';
/**
 * Zod je malá knihovna na ověřování a „tvarování“ dat (validaci). Uděláš si „schéma“ toho, jak mají vypadat vstupy (třeba body/query),
 * Zod ti je zkontroluje, případně rovnou převede na správné typy.
 * chytí špatná data hned na vstupu (ušetří spoustu chyb),
 * umí hezké chybové hlášky,
 * viz listAccounts
 **/


export async function getAccountById(req, res, next) {
  try {
    const q = z.object({ accountId: z.string() }).parse(req.query);
    const item = await AccountsService.getAccountById(q.accountId, req.user);
    if (!item) return res.status(404).json({ error: 'Not Found' });
    res.json(item);
  } catch (e) { next(e); }
}

//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.

export async function listAccounts(req, res, next) {
  try {
    const q = z.object({
      userId: z.string().optional(), //říká, že v parametru může nacházat userId (ale je optional)
      page: z.coerce.number().int().min(1).default(1), //říká, že se tam může nacházat page (je v podstatě optional, protože má nastavenou defaulní hodnotu 1), zároveň udává minimum
      pageSize: z.coerce.number().int().min(1).max(200).default(50)
    }).parse(req.query); //následně se zavolá funkce parse, která si verzme query z requestu
      //všimněte jsi, že jse v try bloku, pokud tedy něco selže, např. page bude záporná hodnota, tak se odchytí vyjímka (kde text chybové hlášky připraví zod)
        //voláme async funkci listAccounts, jelikož chceme počkat na výsledek použijeme před voláním funkce klíčové slovo await
      const data = await AccountsService.listAccounts(q, req.user); //pokud nenastane vyjímka, získají se data ze servisi
    res.json(data); //data se v json pošlou jako výsledek, toto nastaví hlavičku Content-Type: application/json a převede objekt na text (json)
  } catch (e) { next(e); } //zde se volá next a res, rozdíl je v tom, že res rovnou vrací výsledek, a pokud je zaregistrovaná další routa, tak se pošle pro další zpracování dále viz komentář v app.js u error handleru
}

export async function createAccount(req, res, next) {
  try {
    const body = z.object({
      userId: z.string(),
      institutionId: z.string(),
      currency: z.string(),
      name: z.string().optional()
    }).parse(req.body);
    const created = await AccountsService.createAccount(body, req.user);
    res.status(201).json(created);
  } catch (e) { next(e); }
}

export async function updateAccount(req, res, next) {
  try {
    const body = z.object({
      accountId: z.string(),
      name: z.string().optional(),
      note: z.string().optional(),
      isActive: z.boolean().optional()
    }).parse(req.body);
    const updated = await AccountsService.updateAccount(body, req.user);
    res.json(updated);
  } catch (e) { next(e); }
}

export async function closeAccount(req, res, next) {
  try {
    const body = z.object({
      accountId: z.string(),
      closeDate: z.string().date().optional()
    }).parse(req.body);
    const resu = await AccountsService.closeAccount(body, req.user);
    res.json(resu);
  } catch (e) { next(e); }
}

export async function getBalance(req, res, next) {
  try {
    const q = z.object({ accountId: z.string() }).parse(req.query);
    const data = await AccountsService.getBalance(q.accountId, req.user);
    res.json(data);
  } catch (e) { next(e); }
}

export async function getHistory(req, res, next) {
  try {
    const q = z.object({
      accountId: z.string(),
      page: z.coerce.number().int().min(1).default(1),
      pageSize: z.coerce.number().int().min(1).max(200).default(50)
    }).parse(req.query);
    const data = await AccountsService.getHistory(q, req.user);
    res.json(data);
  } catch (e) { next(e); }
}
