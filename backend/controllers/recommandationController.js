const Recommandation = require('../models/Recommandation');

exports.getMesRecommandations = async (req, res) => {
  try {
    const recs = await Recommandation.find({ etudiant: req.user._id })
      .sort({ createdAt: -1 }).limit(10);
    res.json(recs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.marquerLue = async (req, res) => {
  try {
    const rec = await Recommandation.findByIdAndUpdate(req.params.id, { lue: true }, { new: true });
    res.json(rec);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
