import { Db } from 'mongodb';
import clientPromise from './mongodb';

const DATABASE_NAME = 'workout';

export const database = clientPromise.then((client) =>
	client.db(DATABASE_NAME)
);

class DatabaseAdapter {
	constructor(private readonly db: Db) {}

	readonly users = new UsersApi(this.db);
}
class UsersApi {
	constructor(private readonly db: Db) {}
	private get collection() {
		return this.db.collection<UsersDocument>('users');
	}

	getUserByProviderId(provider: string, providerId: string) {
		return database.then((db) =>
			this.collection.findOne({
				identities: {
					$elemMatch: {
						provider,
						providerAccountId: providerId,
					},
				},
			})
		);
	}

	createUser(
		displayName: string,
		identity: {
			provider: string;
			providerAccountId: string;
		}
	) {
		return database.then((db) =>
			this.collection.insertOne({
				displayName,
				status: 'active',
				identities: [identity],
			})
		);
	}
}

interface UsersDocument extends Document {
	id: string;
	displayName: string;
	status: string;

	identities: {
		provider: string;
		providerAccountId: string;
	}[];
}
