export class Controller {
  landing (req, res) {
    res.render('entry', { title: 'Customer Portal' });
  }
}
export default new Controller();
