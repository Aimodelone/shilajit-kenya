import React from 'react'
import VideoModal from '../ModalVideo/VideoModal';
import fImg from '/public/images/funfact3.jpg'
import Image from 'next/image';

const FunFactVideo = (props) => {
    return (
        <div className="funfact-video mt-0">
            <Image src={fImg} alt="" />
            <VideoModal />
        </div>
    )
}

export default FunFactVideo;
