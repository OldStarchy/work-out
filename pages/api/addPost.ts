import {NextApiRequest, NextApiResponse} from 'next';
import clientPromise from '../../lib/mongodb';

export default async (req: NextApiRequest, res: NextApiResponse) => {
	const client = await clientPromise;
	const db = client.db('posts');
	const {title, content} = req.body;

	const post = await db.collection('posts').insertOne({
		title,
		content,
	});

	res.json(post);
}
