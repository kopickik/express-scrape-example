import PlatformsService from '../../services/platforms.service';
import l from '../../../common/logger'

export class Controller {
  all(req, res) {
    PlatformsService.all()
      .then(r => res.json(r));
  }

  byId(req, res) {
    PlatformsService
      .byId(req.params.id)
      .then(r => {
        if (r) res.json(r);
        else res.status(404).end();
      });
  }
}

export default new Controller();
