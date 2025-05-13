const path = require('path');
const fs = require('fs').promises;
const stateModel = require('../models/States');

/////////////--GET--/////////////

const getStates = async (req, res) => {
    const contig = req.query.contig;

    try {
        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        let states = JSON.parse(data);

        states = await Promise.all(
            states.map(async (s) => {
                const exist = await stateModel.findOne({ stateCode: s.code.toLowerCase() });
                if (exist && exist.funfacts?.length > 0) {
                    return { ...s, funfacts: exist.funfacts };
                }
                return s;
            })
        )

        if (contig) {
            if (contig === 'true') {

                const exclude = ['alaska', 'hawaii'];

                states = states.filter(s =>
                    !exclude.includes(s.state.toLowerCase())
                );

                return res.status(200).json(states);
            }
            else {

                const include = ['alaska', 'hawaii'];

                states = states.filter(s =>
                    include.includes(s.state.toLowerCase())
                );
                return res.status(200).json(states);
            }
        }

        return res.status(200).json(states);
    }
    catch (err) {
        console.error("Error: ", err);
        return res.status(404).json({ message: 'Not Found' });
    }
}

const getState = async (req, res) => {

    const code = req.params.state;


    try {

        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const states = JSON.parse(data);

        let state = states.find(s =>
            s.code === code.toUpperCase()
        );

        if (!state) {
            return res.status(404).json({ message: `Invalid state abbreviation parameter` });
        }

        const exist = await stateModel.findOne({ stateCode: code.toLowerCase() });

        if (exist && exist.funfacts?.length > 0) {
            state = { ...state, funfacts: exist.funfacts };
        }

        return res.status(200).json(state);
    }
    catch (err) {
        console.error('Error: ', err);
        return res.status(500).json({ message: 'Server Error!' });
    }
}

const getFunFact = async (req, res) => {

    const code = req.params.state;

    try {

        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const states = JSON.parse(data);

        let state = states.find(s =>
            s.code === code.toUpperCase()
        );

        if (!state) {
            return res.status(404).json({ message: `Invalid state abbreviation parameter` });
        }

        const exist = await stateModel.findOne({ stateCode: code.toLowerCase() });

        if (exist && exist.funfacts?.length > 0) {
            const funfacts = exist.funfacts;
            const randomIndex = Math.floor(Math.random() * funfacts.length);
            const randomFact = funfacts[randomIndex];

            return res.status(200).json({ funfact: randomFact });
        }

        return res.status(404).json({ message: `No Fun Facts found for ${state.state}` })
    }
    catch (err) {
        console.error('Error: ', err);
        return res.status(500).json({ message: 'Server Error!' });
    }

}

const getCapital = async (req, res) => {
    const code = req.params.state;

    try {

        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const states = JSON.parse(data);

        let state = states.find(s =>
            s.code === code.toUpperCase()
        );

        if (!state) {
            return res.status(404).json({ message: `Invalid state abbreviation parameter` });
        }

        return res.status(200).json({ state: state.state, capital: state.capital_city });

    }
    catch (err) {
        console.error("Error: ", err);
        return res.status(500).json({ message: 'Server Error' });
    }
}

const getNickname = async (req, res) => {
    const code = req.params.state;

    try {
        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const states = JSON.parse(data);

        let state = states.find(s =>
            s.code === code.toUpperCase()
        );

        if (!state) {
            return res.status(404).json({ message: `Invalid state abbreviation parameter` });
        }

        return res.status(200).json({ state: state.state, nickname: state.nickname });

    }
    catch (err) {
        console.error("Error: ", err);
        return res.status(500).json({ message: 'Server Error' });
    }

}

const getPop = async (req, res) => {
    const code = req.params.state;

    try {
        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const states = JSON.parse(data);

        let state = states.find(s =>
            s.code === code.toUpperCase()
        );

        if (!state) {
            return res.status(404).json({ message: `Invalid state abbreviation parameter` });
        }

        return res.status(200).json({ state: state.state, population: state.population.toLocaleString() });

    }
    catch (err) {
        console.error("Error: ", err);
        return res.status(500).json({ message: 'Server Error' });
    }

}

const getAdmission = async (req, res) => {
    const code = req.params.state;


    try {
        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const states = JSON.parse(data);

        let state = states.find(s =>
            s.code === code.toUpperCase()
        );

        if (!state) {
            return res.status(404).json({ message: `Invalid state abbreviation parameter` });
        }

        return res.status(200).json({ state: state.state, admitted: state.admission_date });

    }
    catch (err) {
        console.error("Error: ", err);
        return res.status(500).json({ message: 'Server Error' });
    }

}

/////////////--POST--/////////////

const createFunFact = async (req, res) => {
    let state = req.params.state;
    const facts = req.body.funfacts;

    if (!state || !facts) {
        return res.status(400).json({ message: 'State fun facts value required' });
    }

    if(!Array.isArray(facts)){
        return res.status(400).json({ message: 'State fun facts value must be an array' });
    }

    state = state.toLowerCase();

    try {

        const exist = await stateModel.findOne({ stateCode: state });

        if (!exist) {
            const result = await stateModel.create({
                'stateCode': state,
                'funfacts': facts
            });
            return res.status(201).json({result});
        }
        else {
            exist.funfacts.push(...facts);
            exist.save();
            return res.status(201).json({facts});
        }

    }
    catch (err) {
        console.error('Error: ', err);
        return res.status(500).json({ message: 'Server Error' })
    }

}

/////////////--PATCH--/////////////


const updateFunFact = async (req, res) => {

    const code = req.params.state;
    let index = req.body.index;
    const fact = req.body.funfact;

    try {

        if (!index) {
            return res.status(404).json({ message: `State fun fact index value required` });
        }

        if (!fact) {
            return res.status(404).json({ message: `State fun fact value required` });
        }

        index -= 1;

        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const states = JSON.parse(data);

        const state = states.find(s =>
            s.code === code.toUpperCase()
        );

        if (!state) {
            return res.status(404).json({ message: `Invalid state abbreviation parameter` });
        }

        const exist = await stateModel.findOne({ stateCode: code.toLowerCase() });

        if (!exist) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
        }

        if (exist) {
            if (exist.funfacts.length < index + 1) {
                return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}` });
            }
            else {
                exist.funfacts[index] = fact;
                await exist.save();
            }
        }

        return res.status(201).json( exist );
    }
    catch (err) {
        console.error('Error: ', err);
        return res.status(500).json({ message: 'Server Error' })
    }

}

/////////////--DELETE--/////////////


const deleteFunFact = async (req, res) => {
    const code = req.params.state;
    let index = req.body.index;

    try {

        if (!index) {
            return res.status(404).json({ message: `State fun fact index value required` });
        }

        index -= 1;

        const filePath = path.join(__dirname, '..', 'data', 'statesData.json');
        const data = await fs.readFile(filePath, 'utf-8');
        const states = JSON.parse(data);

        const state = states.find(s =>
            s.code === code.toUpperCase()
        );

        if (!state) {
            return res.status(404).json({ message: `Invalid state abbreviation parameter` });
        }

        const exist = await stateModel.findOne({ stateCode: code.toLowerCase() });

        if (!exist) {
            return res.status(404).json({ message: `No Fun Facts found for ${state.state}` });
        }

        if (exist) {
            if (exist.funfacts.length < index + 1) {
                return res.status(404).json({ message: `No Fun Fact found at that index for ${state.state}` });
            }
            else {
                exist.funfacts.splice(index,1);
                await exist.save();
            }
        }
        return res.status(200).json(exist);
    }
    catch (err) {
        console.error('Error: ', err);
        return res.status(500).json({ message: 'Internal Server Error' });
    }

}


module.exports = {
    getStates,
    getState,
    getFunFact,
    getCapital,
    getNickname,
    getPop,
    getAdmission,
    createFunFact,
    updateFunFact,
    deleteFunFact
};






