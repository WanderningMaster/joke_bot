import {XMLParser} from 'fast-xml-parser';

const Commands = {
	JOKE: '/joke',
	START: "/start",
	BUTTON_JOKE: '🎰',
	MAVPA: '/mavpa',
	BUTTON_MAVPA: '🐒',
}

const SCAP_SOURCE = 'https://m.anekdotua.com/%D0%92%D0%B8%D0%BF%D0%B0%D0%B4%D0%BA%D0%BE%D0%B2%D0%B8%D0%B9_%D0%B0%D0%BD%D0%B5%D0%BA%D0%B4%D0%BE%D1%82'

const monkeys = [
	{
		caption: "Мавпа Яблуко",
		source: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExbDA4dm12M3VrcWcwamhiOXU2azh5YTJydnAyamhzZnYyaHJydjFkaiZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Qk8rBzXi7vNKA8mMNf/giphy.gif"
	},
	{
		caption: "Мавпа Груша",
		source: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExZTJ2aGk1NG5ycXRjaG45b3oxMHA2MG5yeXNjNDJycGdubjFtaGl0dSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/ZgYlWSDyJ6xEWapYy9/giphy.gif"
	},
	{
		caption: "Мавпа Мандарин",
		source: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcDhsdWNvbXk1d2p6dWdhend2bWg4aWw0dnBleWEzdmU4ZXBsYm9wayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/Fz42RyQQOxV4jL1A2U/giphy.gif"
	},
	{
		caption: "Мавпа Ананас",
		source: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExcXN2enE5b24xa2o0c3AzcjEzYTkyZ3k2MnZ1ZmdteWF5N3ZkZmJjMSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/AX3e0TISVvmFkOLEPx/giphy.gif"
	},
	{
		caption: "Мавпа Полуниця",
		source: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExYXRwNDJkbDdiN2NwOTczNGtra2Vpc3NqcTF2b3pxMzdoaXczd3FiayZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/UwqNmt9Kr4drwRJW0O/giphy.gif"
	},
	{
		caption: "Мавпа Кавун",
		source: "https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExb2txMnNsb2hnYTZ5N2Y5NGtpc25wbzk2d3c0N2lmbDN1Ym5ndjBoZSZlcD12MV9pbnRlcm5hbF9naWZfYnlfaWQmY3Q9Zw/QldYy7f2TvaYl21Nfj/giphy.gif"
	},
]


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
		text,
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

function randomMonkey() {
	return monkeys[Math.floor(Math.random() * monkeys.length)]
}

async function sendMavpa(baseUrl, chatId) {
	const monkey = randomMonkey()
	const params = {
		chat_id: chatId,
		video: monkey.source,
		caption: monkey.caption,
	}
	const url = `${baseUrl}/sendVideo`
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(params),
	})

	if (res.ok) {
		return new Response('Message sent successfully!', { status: 200 });
	} else {
		return new Response('Failed to send message.', { status: 500 });
	}
}

async function setupKeyboard(baseUrl, chatId, messageId) {
	const params = {
		chat_id: chatId,
		video: monkeys[0].source,
		caption: monkeys[0].caption,
		reply_to_message_id: messageId,
		reply_markup: {
			keyboard: [
				[Commands.BUTTON_JOKE, Commands.BUTTON_MAVPA],
			],
			resize_keyboard: true,
			is_persistent: true,
		},
	}
	const url = `${baseUrl}/sendVideo`
	const res = await fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify(params),
	})

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

			const crazy = message?.dice != undefined

			if(crazy) {
				const data = await scrapJoke();
				const chatId = message.chat.id;

				await sendMessage(TELEGRAM_API, chatId, data)

				return new Response('OK', { status: 200 });
			}
			if (message && message.text) {
				const command = message.text.trim();
				if(command.startsWith(Commands.START)) {
					const chatId = message.chat.id;
					const messageId = message?.id;

					await setupKeyboard(TELEGRAM_API, chatId, messageId)
				}
				if(command.startsWith(Commands.MAVPA) || command === Commands.BUTTON_MAVPA) {
					const chatId = message.chat.id;

					await sendMavpa(TELEGRAM_API, chatId)
				}
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
