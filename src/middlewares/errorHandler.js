//toto je centrální error handler, všimněte si, že pokud někde nastane chyba, tak se nepošle uživateli rovnou přes res, ale volá se next
// (což je v podstatě nějaký další handler, v tomto případě to odchytí tento error handler)
//export = zpřístupníš proměnnou/funkci z jednoho souboru pro použití v jiném.
//jinde pak import { errorHandler } from './middlewares/errorHandler.js';
export function errorHandler(err, req, res, next) {
    if (err.name === 'ZodError' || err?.issues) { //zde se odchytí veškeré ZodErrory
        return res.status(400).json({ error: 'Validation failed', details: err.issues || [] }); //ZoD errory souvisí s validací, tzn. uživatel zadal něco špatně, proto kod 400 - chyba na klientu
    }
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' });
}