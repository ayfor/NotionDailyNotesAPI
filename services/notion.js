const dotenv = require('dotenv').config()  
const { Client } = require("@notionhq/client");

const notion = new Client( { auth: process.env.NOTION_KEY });

const databaseId = process.env.NOTION_DATABASE_ID;

const getDates = async ()=> {

    const res = await notion.databases.query({
        database_id: databaseId,
    });

    console.log(res);
}

const createEntry = async () => {
    const res = await notion.pages.create({
        parent:{
            database_id:databaseId
        },
        properties:{
            'Date Name': {
                title: [
                    {
                        text: {
                            content: 'Sample: September 1st, 2021'
                        }
                    }
                ]
            },
            Date: {
                date:{
                    start: '2021-09-01', //year-month-day
                }
            }
        }
    })

    console.log(res);
}

module.exports = { getDates, createEntry };