import type { GetServerSidePropsContext } from 'next';
import { findAllChannelQuestions } from '@answeroverflow/db';
// eslint-disable-next-line no-restricted-imports
import { Sitemap } from '../../../../utils/sitemap';

export async function getServerSideProps({
	res,
	params,
}: GetServerSidePropsContext) {
	const channelId = params?.channelId as string;
	const communityId = params?.communityId as string;
	const questions = await findAllChannelQuestions({
		channelId,
		includePrivateMessages: false, // TODO: Serve private threads to search engine crawlers only
	});
	const sitemap = new Sitemap(
		'https://www.answeroverflow.com',
		'url',
		questions.map((question) => ({
			loc: `/m/${question.thread.id}`,
			changefreq: question.thread.archivedTimestamp ? 'monthly' : 'daily',
			priority: 0.7,
		})),
	);

	sitemap.add({
		loc: `/c/${communityId}`, // Community page
		changefreq: 'weekly',
		priority: 1,
	});
	sitemap.applyToRes(res);
	res.end();

	return {
		props: {},
	};
}

export default getServerSideProps;
