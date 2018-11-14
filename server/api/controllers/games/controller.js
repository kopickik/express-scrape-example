import GamesService from '../../services/games.service';
import l from '../../../common/logger'

export class Controller {
  all(req, res) {
    GamesService.all()
      .then(r => res.json(r));
  }

  byId(req, res) {
    GamesService
      .byId(req.params.id)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }

  create(req, res) {
    GamesService
      .create(req.body)
      .then(r => res
        .status(201)
        .location(`/api/v1/examples/${r.id}`)
        .json(r));
  }
}

export default new Controller();
