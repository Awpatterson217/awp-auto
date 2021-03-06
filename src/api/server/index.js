'use strict';

/**
 * @author Adam Patterson <awpatterson217@gmail.com>
 */

const express = require('express');

const {
  processManager
} = require('../../');

const config = require('../../../config');

const {
  services: {
    path: servicesPath
  }
} = config;

const router = express.Router();

router.get('/server', (req, res) => {
  processManager.listAll({ servicesPath })
    .then((processes) => {
      res.set('Access-Control-Allow-Origin', '*').status(200).json(processes);
    })
    .catch((error) => {
      console.error(error);

      res.status(500).json(error);
    });
});

router.get('/server/:id', (req, res) => {
  const { id } = req.params;

  processManager.list(id)
    .then((process) => {
      res.set('Access-Control-Allow-Origin', '*').status(200).json(process);
    })
    .catch((error) => {
      console.error(error);

      res.status(500).json(error);
    });
});

router.put('/server', (req, res) => {
  console.log(req.body);

  const {
    action,
    id
  } = req.body;

  if(action === 'suspend') {
    processManager.suspend(id)
      .then((result) => {
        if(result) {
          res.set('Access-Control-Allow-Origin', '*').status(200).json({});
        }
      })
      .catch((error) => {
        console.error(error);

        res.status(500).json(error);
      });
  } else if(action === 'reload') {
    processManager.reload(id)
      .then((result) => {
        if(result) {
          res.set('Access-Control-Allow-Origin', '*').status(200).json({});
        }
      })
      .catch((error) => {
        console.error(error);

        res.status(500).json(error);
      });
  } else if(action === 'start') {
    processManager.start(id)
      .then((result) => {
        if(result) {
          res.set('Access-Control-Allow-Origin', '*').status(200).json({});
        }
      })
      .catch((error) => {
        console.error(error);

        res.status(500).json(error);
      });
  } else {
    const error = new Error('/server/active (PUT) - No matching actions');
    console.error(error);

    res.status(500).json(error);
  }
});

router.delete('/server/:id', (req, res) => {
  const { id } = req.params;

  processManager.remove(id)
    .then((result) => {
      if(result) {
        res.set('Access-Control-Allow-Origin', '*').status(200).json({});
      }
    })
    .catch((error) => {
      console.error(error);

      res.status(500).json(error);
    });
});

module.exports = router;
