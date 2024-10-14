import React from 'react'
import images from '../../services/config/images'

type Props = {}

const CardLoader = (props: Props) => {
    return (
        <div>
            <p className="mb-4 animate-pulse">
                <span
                    className="inline-block rounded-xl min-h-[1em] h-[400px] w-full flex-auto cursor-wait bg-current align-middle text-base text-neutral-700 opacity-50 dark:text-neutral-50">
                    <div className="absolute bottom-28 left-[5%] text-black bg-white/20 backdrop-blur-lg p-2 w-[90%] rounded-xl">
                        <span
                            className="inline-block min-h-[1em] w-full flex-auto cursor-wait bg-black align-middle opacity-80"></span>
                        <div className="text-sm flex flex-row items-center">
                            <img src={images.Location} className="w-[5%] h-full mr-1 opacity-80" />
                            <span
                                className="inline-block min-h-[1em] w-full flex-auto cursor-wait bg-black align-middle opacity-80"></span>
                        </div>
                    </div>
                </span>
            </p>
            <p
                className="mb-4 animate-[placeholder-wave_2s_linear_infinite] [mask-size:200%_100%]">
                <span
                    className="inline-block h-14 rounded-xl w-full flex flex-row items-center justify-center cursor-wait bg-current align-middle text-base text-neutral-700 opacity-50 dark:text-neutral-50">
                    <span
                        className="inline-block min-h-[1em] w-[90%] h-4 cursor-wait bg-black align-middle opacity-80"></span>
                </span>
            </p>
        </div>
    )
}

export default CardLoader;