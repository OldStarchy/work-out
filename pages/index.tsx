import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Content from '../components/Content';
import Layout from '../components/Layout';
import clientPromise from '../lib/mongodb';

type ConnectionStatus = {
	isConnected: boolean;
	posts: Post[];
};

export const getServerSideProps: GetServerSideProps<
	ConnectionStatus
> = async () => {
	try {
		const client = await clientPromise;
		// `await clientPromise` will use the default database passed in the MONGODB_URI
		// However you can use another database (e.g. myDatabase) by replacing the `await clientPromise` with the following code:
		//
		// `const client = await clientPromise`
		// `const db = client.db("myDatabase")`
		//
		// Then you can execute queries against your database like so:
		// db.find({}) or any of the MongoDB Node Driver commands

		const posts = (
			await client.db('posts').collection('posts').find({}).toArray()
		).map(
			(data) => new Post(data._id.toHexString(), data.title, data.content)
		);

		return {
			props: { isConnected: true, posts },
		};
	} catch (e) {
		console.error(e);
		return {
			props: { isConnected: false, posts: [] },
		};
	}
};

interface Workout {
	title: string;
	comments: string | null;
	sets: Set[];
}

interface Set {
	reps: number;
	comment: string | null;
}

export default function Home({
	isConnected,
	posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
	const [currentWorkout, setCurrentWorkout] = useImmer<Workout>({
		title: 'type something',
		comments: null,
		sets: [],
	});

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Layout pageTitle="Track">
				<Content>
					<h1 className="title">no do'nt worry about it mario</h1>
					<ol>
						{workoutHistory.map((item) => (
							<li>
								<pre>
									{JSON.stringify(item, undefined, '\t')}
								</pre>
							</li>
						))}
					</ol>
					<div>
						<label>Workout name</label>
						<input
							type="text"
							value={currentWorkout.title}
							onChange={(e) =>
								setCurrentWorkout((draft) => {
									draft.title = e.target.value;
								})
							}
						/>

						<ol>
							{currentWorkout.sets.map((set, id) => (
								<li>
									<label>Reps</label>
									<input
										type="number"
										value={set.reps}
										onChange={(e) => {
											setCurrentWorkout((draft) => {
												draft.sets[id].reps =
													e.target.valueAsNumber;
											});
										}}
									/>
									<label>Comment</label>
									<input
										type="string"
										value={set.comment ?? ''}
										onChange={(e) => {
											setCurrentWorkout((draft) => {
												draft.sets[id].comment =
													e.target.value || null;
											});
										}}
									/>
									<button
										type="button"
										onClick={() => {
											setCurrentWorkout((draft) => {
												draft.sets.splice(id, 1);
											});
										}}
									/>
								</li>
							))}
							<li>
								<button
									onClick={() =>
										setCurrentWorkout((w) => {
											w.sets.push({
												reps: 0,
												comment: null,
											});
										})
									}
								>
									add set
								</button>
							</li>
						</ol>

						<button
							type="submit"
							onClick={() => {
								setWorkoutHistory((oldList) => [
									...oldList,
									currentWorkout,
								]);
								setCurrentWorkout({
									title: 'type something else',
									comments: null,
									sets: [],
								});
							}}
						>
							Save
						</button>
					</div>
					{/*
					{isConnected ? (
						<>
							<h2 className="subtitle">
								You are connected to MongoDB
							</h2>
							{posts.map((post) => (
								<>
									<div>{post.title}</div>
									<div>{post.content}</div>
								</>
							))}
						</>
					) : (
						<h2 className="subtitle">
							You are NOT connected to MongoDB. Check the{' '}
							<code>README.md</code> for instructions.
						</h2>
					)}

					<p className="description">
						Get started by editing <code>pages/index.js</code>
					</p>

					<div className="grid">
						<a href="https://nextjs.org/docs" className="card">
							<h3>Documentation &rarr;</h3>
							<p>
								Find in-depth information about Next.js features
								and API.
							</p>
						</a>

						<a href="https://nextjs.org/learn" className="card">
							<h3>Learn &rarr;</h3>
							<p>
								Learn about Next.js in an interactive course
								with quizzes!
							</p>
						</a>

						<a
							href="https://github.com/vercel/next.js/tree/canary/examples"
							className="card"
						>
							<h3>Examples &rarr;</h3>
							<p>
								Discover and deploy boilerplate example Next.js
								projects.
							</p>
						</a>

						<a
							href="https://vercel.com/new?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
							target="_blank"
							rel="noopener noreferrer"
							className="card"
						>
							<h3>Deploy &rarr;</h3>
							<p>
								Instantly deploy your Next.js site to a public
								URL with Vercel.
							</p>
						</a>
					</div>
				*/}
				</Content>
			</Layout>
		</>
	);
}

class Post {
	constructor(
		public id: string | null,
		public title: string,
		public content: string
	) {}

	//todo: graphql
	async write() {
		const response = await fetch('http://localhost:3000/api/addPost', {
			method: 'POST',
			body: JSON.stringify({
				title: this.title,
				content: this.content,
			}),
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
		});

		const data = (await response.json()) as { _id: string };

		this.id = data._id;
	}

	static async get() {
		const response = await fetch('http://localhost:3000/api/getPosts', {
			headers: {
				Accept: 'application/json',
			},
		});

		const data = (await response.json()) as {
			id: string;
			title: string;
			content: string;
		}[];

		return data.map((data) => new Post(data.id, data.title, data.content));
	}
}
