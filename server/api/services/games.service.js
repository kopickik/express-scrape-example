import l from '../../common/logger';
import db from './firebase.db.service';

class GamesService {
  all() {
    l.info(`${this.constructor.name}.all()`);
    return db.all();
  }

  byId(id) {
    l.info(`${this.constructor.name}.byId(${id})`);
    return db.byId(id);
  }

  create(body) {
    return db.insert(body);
  }
}

export default new GamesService();
