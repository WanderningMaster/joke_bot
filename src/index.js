import {XMLParser} from 'fast-xml-parser';

const Commands = {
	JOKE: '/joke'
}

const SCAP_SOURCE = 'https://m.anekdotua.com/%D0%92%D0%B8%D0%BF%D0%B0%D0%B4%D0%BA%D0%BE%D0%B2%D0%B8%D0%B9_%D0%B0%D0%BD%D0%B5%D0%BA%D0%B4%D0%BE%D1%82'

const options = {
    ignoreAttributes: false,
    unpairedTags: ["hr", "br", "link", "meta"],
    stopNodes : [ "*.pre", "*.script"],
    processEntities: true,
    htmlEntities: true
}
const parser = new XMLParser(options);

async function scrapJoke() {
	let req = await fetch(SCAP_SOURCE);
	let xmlData = await req.text();
	let data = parser.parse(xmlData);
	const partOne = data.html.body.div[1].div[2].div[2]["#text"] + "\n"
	const partTwo = data.html.body.div[1].div[2].div[2].br.join("\n")

	let node = data.html.body.div[1].div[2].div[2].table?.tr
	if(node == undefined) {
		node = data.html.body.div[1].div[2].div[2].table[1].tr
	}
	const number = "#" + node.td.div.ul.li.nobr.a["@_href"].split("?prev=")[1] + "\n"

	return (number + partOne + partTwo).trim()
}

async function sendMessage(baseUrl, chatId, text) {
	const params = {
		chat_id: chatId,
		text
	}
	const url = `${baseUrl}/sendMessage`
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(params),
	})
	console.log(await res.json())

	if (res.ok) {
		return new Response('Message sent successfully!', { status: 200 });
	} else {
		return new Response('Failed to send message.', { status: 500 });
	}
}

export default {
	async fetch(request, env, _ctx) {
		const TELEGRAM_TOKEN = `${env['BOT_ID']}:${env['BOT_TOKEN']}`
		const TELEGRAM_API = `https://api.telegram.org/bot${TELEGRAM_TOKEN}`

		const { method, headers } = request;

		if (method === 'POST'
			&& headers.get('content-type') === 'application/json'
		) {
			const data = await request.json();
			const { message } = data;

			if (message && message.text) {
				const command = message.text.trim();
				if(command.startsWith(Commands.JOKE)) {
					const data = await scrapJoke();
					const chatId = message.chat.id;

					await sendMessage(TELEGRAM_API, chatId, data)

					return new Response('OK', { status: 200 });
				}
			}
		}

		return new Response('OK', { status: 200 });
	},
};
