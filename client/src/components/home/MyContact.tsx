
import React from "react";
import {useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button} from "@/components/ui/button.tsx";
import {motion} from "framer-motion";
import {Clock, Facebook, Instagram, Linkedin, Mail, Phone, Twitter} from "lucide-react";

export default function MyContact(){

    const schema = z.object({
        name: z.string().min(2, "Za krótkie imię"),
        email: z.string().email("Nieprawidłowy format email"),
        phone: z.string().min(9, "Za krótki numer"),
        message: z.string().min(10, "Message must be at least 10 characters")
    })

    const {register,
    handleSubmit,
    formState:{errors},
    } = useForm({
        resolver: zodResolver(schema),
        mode:"onSubmit",
    });

    function onSubmit(data){

        console.log(data);
    }


    return (
        <section id="contact" className="container px-4  md:py-24  sm:px-6 lg:px-8 rounded-lg mt-12 " >

            <div className=" px-4 pt-4 sm:px-6 lg:px-8 bg-orange-400 rounded-t-lg ">
                <h2 className="text-3xl md:text-4xl font-bold text-white">Contact Us</h2>
                <p className="mt-4 pb-4 text-xl text-white ">
                        Ready to start your project? Get in touch with our team for a consultation.
                </p>
            </div>

            <div className="px-4 pt-4 text-black bg-white">
                <form onSubmit={handleSubmit(onSubmit)}>
                    <div>
                    <label className="mb-2 block">Imię</label>
                    <input {...register("name")} placeholder="Twoje imie..." className="shadow-inner rounded-sm px-2 py-1 mb-2 focus:outline-none focus:border-gray-500 ml-auto bg-gray-50" />
                        {errors.name && <p className="my-2 text-red-200">{errors.name.message}</p>}
                    </div>

                    <div>
                    <label className="block mb-2 mr-2">Telefon</label>
                    <input {...register("phone")} placeholder="Numer tel." className="shadow-inner rounded-sm px-2 py-1 mb-2 focus:outline-none focus:border-gray-500 bg-gray-50" />
                    </div>

                    <div>
                        <label className="block mb-2 mr-2">Email</label>
                        <input {...register("email")} placeholder="@Twój email" className="shadow-inner rounded-sm px-2 py-1 mb-2 focus:outline-none focus:border-gray-500 bg-gray-50" />
                    </div>

                    <div>
                        <label className="block mb-2 mr-2">Wiadomość</label>
                        <textarea {...register("message")} placeholder="W czym możemy pomóc?" className=" shadow-inner rounded-sm px-2 py-1 mb-2 focus:outline-none focus:border-gray-500 w-full h-40 bg-gray-50" />
                    </div>

                    <div>
                        <Button type="submit" variant="default" >
                            Wyślij
                        </Button>
                    </div>
                </form>
            </div>

            <div>
                <div className="bg-white p-8 rounded-lg h-full ">

                    <div className="space-y-6 grid grid-cols-2 gap-4">
                        <div className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <div className="bg-primary-100 rounded-full text-primary-500">
                                    <Phone className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Phone</h4>
                                <p className="mt-1 text-gray-600">(555) 123-4567</p>
                            </div>
                        </div>

                        <div  className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <div className="bg-primary-100 p-3 rounded-full text-primary-500">
                                    <Mail className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Email</h4>
                                <p className="mt-1 text-gray-600">info@handypro.com</p>
                            </div>
                        </div>

                        <div  className="flex items-start">
                            <div className="flex-shrink-0 mt-1">
                                <div className="bg-primary-100 rounded-full text-primary-500">
                                    <Clock className="h-5 w-5" />
                                </div>
                            </div>
                            <div className="ml-4">
                                <h4 className="text-lg font-medium text-gray-900">Working Hours</h4>
                                <p className="mt-1 text-gray-600">Monday - Friday: 8:00 AM - 6:00 PM</p>
                                <p className="text-gray-600">Saturday: 9:00 AM - 4:00 PM</p>
                                <p className="text-gray-600">Sunday: Closed</p>
                            </div>
                        </div>

                        <div className="ml-2">
                            <h4 className="text-lg font-medium text-gray-900 mb-4 ml-auto">Follow Us</h4>
                            <div className="flex space-x-4">
                                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                                    <Facebook className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                                    <Instagram className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                                    <Twitter className="h-5 w-5" />
                                </a>
                                <a href="#" className="text-gray-600 hover:text-primary-500 transition-colors">
                                    <Linkedin className="h-5 w-5" />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>



        </section>
    )
}

