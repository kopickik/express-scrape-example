export class Controller {
  landing (req, res) {
    res.render('index', { title: 'Customer Portal' });
  }
}
export default new Controller();
