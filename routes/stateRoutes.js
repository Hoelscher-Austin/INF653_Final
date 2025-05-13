const express = require('express');
const stateController = require('../controllers/stateController');

const router = express.Router();

// GET Routes

router.get('/', stateController.getStates);
router.get('/:state', stateController.getState);
router.get('/:state/funfact', stateController.getFunFact);
router.get('/:state/capital', stateController.getCapital);
router.get('/:state/nickname', stateController.getNickname);
router.get('/:state/population', stateController.getPop);
router.get('/:state/admission', stateController.getAdmission);

// POST Routes

router.post('/:state/funfact', stateController.createFunFact);

// PATCH Routes

router.patch('/:state/funfact', stateController.updateFunFact);

// DELETE Routes

router.delete('/:state/funfact', stateController.deleteFunFact);

module.exports = router;