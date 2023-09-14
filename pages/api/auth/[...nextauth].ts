import { MongoDBAdapter } from '@auth/mongodb-adapter';
import NextAuth, { NextAuthOptions } from 'next-auth';
import DiscordProvider from 'next-auth/providers/discord';
import clientPromise from '../../../lib/mongodb';
// import EmailProvider from 'next-auth/providers/email';

function assertString(str: string | undefined): string {
	if (typeof str !== 'string') {
		throw new Error('Expected string');
	}

	return str;
}

export const authOptions: NextAuthOptions = {
	secret: assertString(process.env.SECRET),
	adapter: MongoDBAdapter(clientPromise, {
		databaseName: 'workouth-auth',
	}),
	providers: [
		// OAuth authentication providers
		DiscordProvider({
			clientId: assertString(process.env.DISCORD_ID),
			clientSecret: assertString(process.env.DISCORD_SECRET),
		}),
		// Sign in with passwordless email link
		// EmailProvider({
		// 	server: process.env.MAIL_SERVER,
		// 	from: '<no-reply@example.com>',
		// }),
	],
};

export default NextAuth(authOptions);
