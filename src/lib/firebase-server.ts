'use server';

import { getServerInitializedFirebase } from './firebase';

const { app, auth, db } = getServerInitializedFirebase();

export { app, auth, db };
