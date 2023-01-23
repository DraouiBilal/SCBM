import sgmail from '@sendgrid/mail';

type Email = {
    to: string;
    subject: string;
    html: string;
};

export const sendEmail = async ({html,subject,to}:Email) => {
    sgmail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const msg = {
        to,
        from: 'darkking.bilal@gmail.com',
        subject,
        html,
    };
    console.log(msg);
    
    const res = await sgmail.send(msg);
    console.log(res);
    return res
};