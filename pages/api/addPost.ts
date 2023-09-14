import { NextApiRequest, NextApiResponse } from 'next';
import { DefaultSession, getServerSession } from 'next-auth';
import { usersPromise } from '../../lib/mongodb';
import { authOptions } from './auth/[...nextauth]';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
		} & DefaultSession['user'];
	}
}

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const usersCollection = await usersPromise;
	const session = await getServerSession(req, res, authOptions);
	const { status } = req.body;
	if (!session) return;

	console.log(session);
	console.log(status);
	const user = (await authOptions.adapter!.getUserByEmail!(
		session.user.email!
	))!;
	console.log(user);
	console.log(await usersCollection.find({}).toArray());
	await usersCollection.updateOne(
		{ id: user.id },
		{
			$set: {
				id: user.id,
				status: `${status}`,
			},
		},
		{
			upsert: true,
		}
	);

	res.redirect(307, '/');
};
