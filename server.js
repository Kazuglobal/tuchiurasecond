const express = require('express');
const { Client } = require('@notionhq/client');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

const notion = new Client({
    auth: process.env.NOTION_API_KEY,
});

const ADDRESS_DATABASE_ID = process.env.NOTION_ADDRESS_DATABASE_ID;
const DECEASED_DATABASE_ID = process.env.NOTION_DECEASED_DATABASE_ID;

app.post('/api/address-change', async (req, res) => {
    try {
        const { name, era, graduationYear, oldAddress, newAddress, changeDate, remarks } = req.body;

        const response = await notion.pages.create({
            parent: {
                database_id: ADDRESS_DATABASE_ID,
            },
            properties: {
                Name: {
                    title: [
                        {
                            text: {
                                content: name,
                            },
                        },
                    ],
                },
                "卒業年": {
                    rich_text: [
                        {
                            text: {
                                content: `${era}${graduationYear}年`,
                            },
                        },
                    ],
                },
                "旧住所": {
                    rich_text: [
                        {
                            text: {
                                content: oldAddress,
                            },
                        },
                    ],
                },
                "新住所": {
                    rich_text: [
                        {
                            text: {
                                content: newAddress,
                            },
                        },
                    ],
                },
                "変更日": {
                    date: {
                        start: changeDate,
                    },
                },
                "備考": {
                    rich_text: [
                        {
                            text: {
                                content: remarks || '',
                            },
                        },
                    ],
                },
            },
        });

        res.json({ success: true, message: '住所変更が正常に登録されました' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'エラーが発生しました' });
    }
});

app.post('/api/deceased-info', async (req, res) => {
    try {
        const { deceasedName, deathDate, notifierName, relationship, contact, message } = req.body;

        const response = await notion.pages.create({
            parent: {
                database_id: DECEASED_DATABASE_ID,
            },
            properties: {
                "故人氏名": {
                    title: [
                        {
                            text: {
                                content: deceasedName,
                            },
                        },
                    ],
                },
                "没年月日": {
                    date: {
                        start: deathDate,
                    },
                },
                "通知者氏名": {
                    rich_text: [
                        {
                            text: {
                                content: notifierName,
                            },
                        },
                    ],
                },
                "続柄": {
                    rich_text: [
                        {
                            text: {
                                content: relationship,
                            },
                        },
                    ],
                },
                "連絡先": {
                    phone_number: contact,
                },
                "メッセージ": {
                    rich_text: [
                        {
                            text: {
                                content: message || '',
                            },
                        },
                    ],
                },
            },
        });

        res.json({ success: true, message: '物故者情報が正常に登録されました' });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ success: false, message: 'エラーが発生しました' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 