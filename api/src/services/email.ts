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
        from: 'bilal.draoui@etu.uae.ac.ma',
        subject,
        html,
    };
    await sgmail.send(msg);
};