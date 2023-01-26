import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

import {preview} from '../assets';
import {getRandomPrompt} from '../utils';
import {FormField, Loader} from '../components';


const CreatePost = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        prompt: '',
        photo: '',
    });
    //To be used with API
    const [generatedImage, setGeneratedImage] = useState(false);
    const [loading, setLoading] = useState(false);

    const generateImage = async () => {
        if (form.prompt) {
            try {
                setGeneratedImage(true);
                const response = await fetch('http://localhost:8080/api/v1/dalle', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        prompt: form.prompt,
                    }),
                });
                const data = await response.json();
                //This will save and render our image
                setForm({...form, photo: `data:image/jpeg;base64,${data.photo}`});
            } catch (e) {
                alert(e);
                console.log(e);
            } finally {
                setGeneratedImage(false);
            }
        } else {
            alert('Please enter a prompt')
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (form.prompt && form.photo) {
            setLoading(true);

            try {
                const response = await fetch('http://localhost:8080/api/v1/post', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(form),
                });
                await response.json();
                navigate('/');
            } catch (error) {
                alert(error);
                setLoading(false);
            }

        } else {
            alert('Please enter a prompt to create an image')
        }

    }

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value})
    }

    const handleSurpriseMe = () => {
        const randomPrompt = getRandomPrompt(form.prompt);
        setForm({...form, prompt: randomPrompt})
    }

    const backToHome = () => {
        navigate('/');
    }

    return (
        <section className="max-w-7xl mx-auto">
            <div>
                <h1 className="font-extrabold text-[#222328] text-[32px]">
                    Create
                    <p className="mt-2 text-[#666e75] text-[16px] max-w [500px]">
                        Create imaginative and visually stunning images. Share your creations with the community.
                    </p>
                </h1>
            </div>

            <form className="mt-16 max-w-3xl" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-5">
                    <FormField
                        labelName="Your Name"
                        type="text"
                        name="name"
                        placeholder="Ex. john appleseed"
                        value={form.name}
                        handleChange={handleChange}
                    />

                    <FormField
                        labelName="Prompt"
                        type="text"
                        name="prompt"
                        placeholder="An Impressionist oil painting of sunflowers in a purple vase…"
                        value={form.prompt}
                        handleChange={handleChange}
                        isSurpriseMe
                        handleSurpriseMe={handleSurpriseMe}
                    />
                    <div
                        //This code is using a ternary operator to determine which image to display on a webpage.
                        // If the "form.photo" variable is truthy (meaning it exists and has a value),
                        // the code will display an image with the source set to the value of the "form.photo"
                        className="relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center">
                        {form.photo ? (
                            <img src={form.photo}
                                 alt={form.prompt}
                                 className="w-full h-full object-contain"
                            />
                        ) : (
                            <img src={preview}
                                 alt="preview"
                                 className="w-9/12 h-9/12 object-contain opacity-40"
                            />
                        )}
                        {generatedImage && (
                            <div
                                className="absolute inset-0 z-0 flex justify-center items-center bg-[rgba(0,0,0,0.5)] rounded-lg">
                                <Loader/>
                            </div>
                        )}
                    </div>
                </div>
                <div className="mt-5 flex gap-5">
                    <button
                        type="button"
                        onClick={generateImage}
                        className="text-white bg-[#03C03C] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {generatedImage ? 'Generating...' : 'Generate Image'}
                    </button>
                </div>
                <div className="mt-10">
                    <p className="mt-2 text-[#666e75] text-[14px]">Once you have created the image you want, you can
                        share it with the community.</p>
                    <button
                        type="submit"
                        className=" mt-3 text-white bg-[#007FFF] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center"
                    >
                        {loading ? 'Sharing...' : 'Share with the community'}
                    </button>

                    <div>
                    <button
                        className=" mt-3 text-white bg-[#4C516D] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center "
                        onClick={backToHome}
                    >
                        Back to home page
                    </button>
                    </div>
                </div>
            </form>
        </section>
    );
};
export default CreatePost;