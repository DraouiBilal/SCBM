import { useEffect } from "react"
import { Loading as LoadingAnimation } from "notiflix";

type props = {
    loading: {
        isLoading: boolean,
        message: string
    }
}

const Loading = ({loading:{isLoading, message}}: props) => {


    useEffect(() => {
        if(isLoading)
            LoadingAnimation.circle(message);
        else
            LoadingAnimation.remove();
    },[isLoading])

    return (
        <div></div>
    )
}

export default Loading;