'use client';

import { getClientInitializedFirebase } from './firebase';

const { app, auth, db } = getClientInitializedFirebase();

export { app, auth, db };
