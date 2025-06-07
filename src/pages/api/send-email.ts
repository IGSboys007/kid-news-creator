{\rtf1\ansi\ansicpg1252\cocoartf2822
\cocoatextscaling0\cocoaplatform0{\fonttbl\f0\fswiss\fcharset0 Helvetica;}
{\colortbl;\red255\green255\blue255;}
{\*\expandedcolortbl;;}
\margl1440\margr1440\vieww15140\viewh9820\viewkind0
\pard\tx720\tx1440\tx2160\tx2880\tx3600\tx4320\tx5040\tx5760\tx6480\tx7200\tx7920\tx8640\pardirnatural\partightenfactor0

\f0\fs24 \cf0 import \{ Resend \} from 'resend';\
\
const resend = new Resend(process.env.RESEND_API_KEY);\
\
export default async function handler(req, res) \{\
  if (req.method !== 'POST') \{\
    return res.status(405).json(\{ error: 'Method not allowed' \});\
  \}\
\
  const \{ to, subject, html \} = req.body;\
\
  try \{\
    const response = await resend.emails.send(\{\
      from: 'Kid News <test@kidsnewsdaily.news>',\
      to,\
      subject,\
      html,\
    \});\
\
    return res.status(200).json(\{ success: true, data: response \});\
  \} catch (error) \{\
    return res.status(500).json(\{ success: false, error: error.message \});\
  \}\
\}\
}