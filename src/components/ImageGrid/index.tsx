import React, { useEffect, useRef, useState } from 'react';
import imagesas from '../../services/config/images';
import { motion, AnimatePresence } from "framer-motion";

interface ImageGridProps {
    images: string[];
}

const ImageGrid: React.FC<ImageGridProps> = ({ images }) => {
    const scrollViewRef = useRef<HTMLDivElement>(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(0);
    const [imageHeights, setImageHeights] = useState<number[]>([]);
    const [singleImageHeights, setSingleImageHeights] = useState<{ width: number; height: number }[]>([]);

    const openModal = (index: number) => {
        setSelectedIndex(index);
        setModalVisible(true);
    };


    const renderImage = () => {
        return (
            <div className="grid grid-cols-2 gap-1 w-full">
                {images.slice(0, 4).map((image, index) => {
                    if (index === 3 && images.length > 4) {
                        return (
                            <div
                                key={index}
                                className="relative cursor-pointer"
                                onClick={() => openModal(index)}
                            >
                                <img
                                    src={image}
                                    className="w-full h-40 rounded-md object-cover"
                                    alt={`Grid image ${index}`}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                                    <span className="text-white text-xl font-bold">+{images.length - 4}</span>
                                </div>
                            </div>
                        );
                    }

                    if (index === 3 && images.length === 4) {
                        return (
                            <div
                                key={index}
                                className="relative cursor-pointer"
                                onClick={() => openModal(index)}
                            >
                                <img
                                    src={image}
                                    className="w-full h-40 rounded-md object-cover"
                                    alt={`Grid image ${index}`}
                                />
                                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center rounded-md">
                                    <span className="text-white text-xl font-bold">+{images.length - index}</span>
                                </div>
                            </div>
                        );
                    }

                    return (
                        <div
                            key={index}
                            className="cursor-pointer"
                            onClick={() => openModal(index)}
                        >
                            <img
                                src={image}
                                className="w-full h-40 rounded-md object-cover"
                                alt={`Grid image ${index}`}
                            />
                        </div>
                    );
                })}
            </div>
        );
    };

    const renderSingleImage = () => {
        const image = images[0];
        if (image) {
            return (
                <div
                    className="relative max-h-96 cursor-pointer rounded-md overflow-hidden"
                    onClick={() => openModal(0)}
                >
                    <img
                        src={image}
                        className="w-full h-96 object-cover rounded-md"
                        alt="Single image"
                    />
                    {images.length > 1 && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-md">
                            <span className="text-white text-xl font-bold">+{images.length - 1}</span>
                        </div>
                    )}
                </div>
            );
        }
        return null;
    };

    useEffect(() => {
        if (modalVisible && scrollViewRef.current) {
            scrollViewRef.current.scrollTo({ left: selectedIndex * window.innerWidth, behavior: 'auto' });
        }
    }, [modalVisible, selectedIndex]);

    const checkHeight = (imgUri: string, index: number): Promise<{ index: number; height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const aspectRatio = img.height / img.width;
                const calculatedHeight = window.innerWidth * aspectRatio;
                resolve({ index, height: calculatedHeight });
            };
            img.onerror = (error) => reject(error);
            img.src = imgUri;
        });
    };

    const calculateHeights = async () => {
        try {
            const heightsPromises = images.map((image, index) => checkHeight(image, index));
            const heights = await Promise.all(heightsPromises);
            const heightsArray = Array(images.length).fill(0);
            heights.forEach(({ index, height }) => {
                heightsArray[index] = height;
            });
            setImageHeights(heightsArray);
        } catch (error) {
            console.error('Error calculating image heights:', error);
        }
    };

    const checkDimensions = (imgUri: string, index: number): Promise<{ index: number; width: number; height: number }> => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                const aspectRatio = img.width / img.height;
                let calculatedWidth, calculatedHeight;
                if (img.width > window.innerWidth * 0.64) {
                    calculatedWidth = window.innerWidth * 0.65;
                    calculatedHeight = calculatedWidth / aspectRatio;
                } else {
                    calculatedWidth = img.width;
                    calculatedHeight = img.height;
                }
                if (calculatedHeight > window.innerHeight) {
                    calculatedHeight = window.innerHeight * 0.65;
                    calculatedWidth = calculatedHeight * aspectRatio;
                }
                resolve({ index, width: calculatedWidth, height: calculatedHeight });
            };
            img.onerror = (error) => reject(error);
            img.src = imgUri;
        });
    };

    const calculateDimensions = async () => {
        try {
            const dimensionsPromises = images.map((image, index) => checkDimensions(image, index));
            const dimensions = await Promise.all(dimensionsPromises);
            const dimensionsArray = Array(images.length).fill({ width: 0, height: 0 });
            dimensions.forEach(({ index, width, height }) => {
                dimensionsArray[index] = { width, height };
            });
            setSingleImageHeights(dimensionsArray);
        } catch (error) {
            console.error('Error calculating image dimensions:', error);
        }
    };

    useEffect(() => {
        calculateDimensions();
    }, [images]);

    useEffect(() => {
        calculateHeights();
    }, [images]);

    return (
        <div className="w-full">
            {images.length > 3 ? (
                <div className="flex flex-wrap justify-between py-1">{renderImage()}</div>
            ) : (
                <div>{renderSingleImage()}</div>
            )}


            {modalVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-90 flex flex-col items-center justify-center z-50" onClick={() => setModalVisible(false)}>
                    <button
                        className="absolute top-10 right-10 text-white font-bold text-lg cursor-pointer z-10"
                        onClick={() => setModalVisible(false)}
                    >
                        Close
                    </button>
                    <div className="relative w-full h-full flex items-center">
                        {
                            images.length > 1 &&
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedIndex(prevIndex => Math.max(prevIndex - 1, 0));
                                }}
                                className="absolute active:opacity-80 left-5 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-70 text-white p-3 rounded-full z-10 w-14 h-14 flex items-center justify-center"
                            >
                                <img src={imagesas.buttonArrow} className='w-4 h-6 rotate-180' />
                            </button>
                        }

                        <div
                            ref={scrollViewRef}
                            className="flex overflow-hidden w-full h-full"
                            style={{ position: 'relative' }}
                        >
                            <div
                                className="flex justify-center items-center snap-center"
                                style={{
                                    minWidth: '100%',
                                    height: '100%',
                                }}
                            >
                                <img
                                    src={images[selectedIndex]}
                                    className="object-contain max-h-[80vh] max-w-full rounded-md"
                                />
                            </div>
                        </div>

                        {
                            images.length > 1 &&
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    setSelectedIndex(prevIndex => Math.min(prevIndex + 1, images.length - 1));
                                }
                                }
                                className="absolute active:opacity-80 right-5 top-1/2 transform -translate-y-1/2 bg-gray-700 bg-opacity-70 text-white p-3 rounded-full z-10 w-14 h-14 flex items-center justify-center"
                            >
                                <img src={imagesas.buttonArrow} className='w-4 h-6' />
                            </button>
                        }
                    </div>
                    <div className='absolute bottom-10 text-white flex flex-row gap-3 items-center'>
                        {
                            images.map((item, index) => {
                                return <img
                                    key={index}
                                    src={item}
                                    className={index === selectedIndex ? 'w-20 h-20 cursor-pointer border-2 border-white rounded-md' : 'w-16 h-16 cursor-pointer rounded-md'}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        setSelectedIndex(index)
                                    }}
                                />
                            })
                        }
                    </div>
                </div>
            )}


        </div>
    );
};

export default ImageGrid;
