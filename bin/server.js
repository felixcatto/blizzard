#!/usr/bin/env node
import getServer from '../main';

getServer().listen(process.env.PORT || 4000, '0.0.0.0');
