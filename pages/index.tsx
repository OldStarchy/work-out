import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { getSession, signIn, signOut, useSession } from 'next-auth/react';
import { useState } from 'react';
import { ImmerReducer, useImmer } from 'use-immer';
import clientPromise, { usersPromise } from '../lib/mongodb';
import { Excersize } from '../state/Exdersize';
import { Workout } from '../state/Workout';
import { createDefaultWorkout } from '../state/createDefaultWorkout';
import { authOptions } from './api/auth/[...nextauth]';

type ConnectionStatus = {
	isConnected: boolean;
	// posts: Post[];
	userStatus: string | null;
	userStatuses: string[];
};

export const getServerSideProps: GetServerSideProps<ConnectionStatus> = async (
	ctx
) => {
	try {
		const client = await clientPromise;
		const users = await usersPromise;
		const session = await getSession(ctx);

		const user =
			session?.user?.email &&
			(await authOptions.adapter!.getUserByEmail!(session.user.email));
		const userData = user ? await users.findOne({ id: user.id }) : null;

		// `await clientPromise` will use the default database passed in the MONGODB_URI
		// However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
		//
		// `const client = await clientPromise`
		// `const db = client.db("myDatabase")`
		//
		// Then you can execute queries against your database like so:
		// db.find({}) or any of the MongoDB Node Driver commands

		// const posts = (
		// 	await client.db('posts').collection('posts').find({}).toArray()
		// ).map(
		// 	(data) => new Post(data._id.toHexString(), data.title, data.content)
		// );

		const allUsers = await Promise.all(
			(
				await users.find({}).toArray()
			).map(async (u) => ({
				authUser: await authOptions.adapter!.getUser!(u.id),
				user: u,
			}))
		);

		const userStatuses = allUsers.map(
			(u) => `${u.authUser?.name ?? '??'}: ${u.user.status}`
		);
		console.log({
			user,
			userData,
			userStatuses,
			foo: 'foo',
		});

		return {
			props: {
				isConnected: true,
				// posts,
				userStatuses,
				userStatus: userData?.status ?? null,
			},
		};
	} catch (e) {
		console.error(e);
		return {
			props: {
				isConnected: false,
				// posts: [],
				userStatuses: [],
				userStatus: `${e}`,
			},
		};
	}
};

type WorkoutAction =
	| {
			type: 'addExcersize';
			excersize: Excersize;
	  }
	| {
			type: 'removeExcersize';
			excersizeIndex: number;
	  }
	| {
			type: 'changeExcersize';
			excersizeIndex: number;
			excersize: Excersize;
	  };

const workoutReducer: ImmerReducer<Workout, WorkoutAction> = (
	state,
	action
) => {
	switch (action.type) {
		case 'addExcersize':
			state.excersizes.push(action.excersize);
			return;
		case 'removeExcersize':
			state.excersizes.splice(action.excersizeIndex, 1);
			return;
		case 'changeExcersize':
			state.excersizes[action.excersizeIndex] = action.excersize;
			return;
		default:
			throw new Error('Invalid action type');
	}
};

export default function Home({
	isConnected,
	// posts,
	userStatuses,
	userStatus,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [workoutHistory, setWorkoutHistory] = useState<Excersize[]>([]);
	const [currentWorkout, setCurrentWorkout] = useImmer<Excersize | null>(
		createDefaultWorkout()
	);

	// const [a, dispatchA] = useReducer(workoutReducer, [], () => [
	// 	createDefaultWorkout(),
	// ]);

	const previousSimilarWorkouts =
		currentWorkout && currentWorkout.excersize.length > 3
			? workoutHistory.filter(
					(w) => w.excersize === currentWorkout.excersize
			  )
			: [];
	const lastReps =
		currentWorkout?.sets[currentWorkout.sets.length - 1]?.reps ?? 8;

	const { data: session } = useSession();

	if (!session?.user) {
		return (
			<div>
				Not signed in <button onClick={() => signIn()}>Sign in</button>
			</div>
		);
	} else {
		return (
			<div>
				Hello {session.user.name}{' '}
				{session.user.image && (
					<img
						src={session.user.image}
						width="128"
						height="128"
						alt={`${session.user.name}'s Profile Image`}
					/>
				)}
				<button onClick={() => signOut()}>Sign out</button>
				<form action="/api/addPost" method="post">
					<input defaultValue={userStatus ?? ''} name="status" />
					<button type="submit">Add Status</button>
				</form>
				<ul>
					{userStatuses.map((status, i) => (
						<li key={i}>{status}</li>
					))}
				</ul>
			</div>
		);
	}
}

// class Post {
// 	constructor(
// 		public id: string | null,
// 		public title: string,
// 		public content: string
// 	) {}

// 	//todo: graphql
// 	async write() {
// 		const response = await fetch('http://localhost:3000/api/addPost', {
// 			method: 'POST',
// 			body: JSON.stringify({
// 				title: this.title,
// 				content: this.content,
// 			}),
// 			headers: {
// 				Accept: 'application/json',
// 				'Content-Type': 'application/json',
// 			},
// 		});

// 		const data = (await response.json()) as { _id: string };

// 		this.id = data._id;
// 	}

// 	static async get() {
// 		const response = await fetch('http://localhost:3000/api/getPosts', {
// 			headers: {
// 				Accept: 'application/json',
// 			},
// 		});

// 		const data = (await response.json()) as {
// 			id: string;
// 			title: string;
// 			content: string;
// 		}[];

// 		return data.map((data) => new Post(data.id, data.title, data.content));
// 	}
// }
