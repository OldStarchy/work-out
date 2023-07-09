import type { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Head from 'next/head';
import { useState } from 'react';
import { useImmer } from 'use-immer';
import Content from '../components/Content';
import DateTimePicker from '../components/DateTimePicker';
import Layout from '../components/Layout';
import SuggestBox from '../components/SuggestBox';
import WorkoutSummary from '../components/WorkoutSummary';
import clientPromise from '../lib/mongodb';
import { Workout } from '../state/Workout';
import { createDefaultWorkout } from '../state/createDefaultWorkout';

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

export default function Home({
	isConnected,
	posts,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [workoutHistory, setWorkoutHistory] = useState<Workout[]>([]);
	const [currentWorkout, setCurrentWorkout] = useImmer<Workout>(
		createDefaultWorkout()
	);

	const previousSimilarWorkouts =
		currentWorkout.title.length > 3
			? workoutHistory.filter((w) => w.title === currentWorkout.title)
			: [];
	const lastReps =
		currentWorkout.sets[currentWorkout.sets.length - 1]?.reps ?? 8;

	return (
		<>
			<Head>
				<title>Create Next App</title>
				<link rel="icon" href="/favicon.ico" />
			</Head>

			<Layout pageTitle="Track">
				<Content>
					<div>
						<label>Workout</label>
						<SuggestBox
							value={currentWorkout.title}
							options={[
								'bench press',
								'overhead press',
								'barbell row',
								'pull up',
								'chin up',
								'push up',
								'curl',
								'hammer curl',
								'lat raise',
							]}
							onChange={(value) =>
								setCurrentWorkout((draft) => {
									draft.title = value;
								})
							}
						/>
						{previousSimilarWorkouts.length > 0 && (
							<>
								<h3>
									Last time you did {currentWorkout.title}...
								</h3>
								<ol>
									{previousSimilarWorkouts.map((w, id) => (
										<li key={id}>
											<WorkoutSummary workout={w} />
										</li>
									))}
								</ol>
							</>
						)}

						<h2>Record a new excersize</h2>
						<DateTimePicker
							value={currentWorkout.date}
							onChange={(value) => {
								setCurrentWorkout((draft) => {
									draft.date = value;
								});
							}}
						/>
						<ol>
							{currentWorkout.sets.map((set, id) => (
								<li>
									<h4>Set #{id + 1}</h4>
									<label>
										<input
											type="number"
											value={set.reps}
											style={{
												width: '3em',
											}}
											onChange={(e) => {
												setCurrentWorkout((draft) => {
													draft.sets[id].reps =
														e.target.valueAsNumber;
												});
											}}
										/>
										Reps
									</label>
									{set.comment !== null ? (
										<input
											type="string"
											placeholder="Comment"
											value={set.comment ?? ''}
											onChange={(e) => {
												setCurrentWorkout((draft) => {
													draft.sets[id].comment =
														e.target.value || null;
												});
											}}
										/>
									) : (
										<button
											type="button"
											onClick={() => {
												setCurrentWorkout((draft) => {
													draft.sets[id].comment = '';
												});
											}}
										>
											Add comment
										</button>
									)}
									<button
										type="button"
										onClick={() => {
											setCurrentWorkout((draft) => {
												draft.sets.splice(id, 1);
											});
										}}
									>
										Delete
									</button>
								</li>
							))}
							<li>
								<button
									onClick={() =>
										setCurrentWorkout((w) => {
											w.sets.push({
												reps: lastReps,
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
								setCurrentWorkout(createDefaultWorkout());
							}}
						>
							Save
						</button>
					</div>
					<h2>Workout history</h2>
					{workoutHistory.length > 0 ? (
						<ol>
							{workoutHistory.map((item, id) => (
								<li key={id}>
									<WorkoutSummary workout={item} />
								</li>
							))}
						</ol>
					) : (
						<p>No recorded history</p>
					)}

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
