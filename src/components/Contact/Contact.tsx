import React from 'react'

export default function Contact() {
  return (
    <div className="relative bg-transparent ">
     <section className="bg-[#fbfbfb] ">
    <div className="container px-6 py-12 mx-auto">
        <div className="text-center">
            <p className="font-medium text-[#831670] ">Contact us</p>

            <h1 className="mt-2 text-2xl font-semibold text-[#fb6f92] md:text-3xl ">Get in touch</h1>

            <p className="mt-3 text-[#831670] ">Our friendly team is always here to chat.</p>
        </div>

        <div className="grid grid-cols-1 gap-12 mt-10 md:grid-cols-2 lg:grid-cols-3">
            <div className="flex flex-col items-center justify-center text-center">
                <span className="p-3 text-[#831670] rounded-full bg-[#fee0f9] ">
                   <img src="/mail.png" width={40} alt="icon" />
                </span>

                <h2 className="mt-4 text-lg font-medium text-[#831670] ">Email</h2>
                <p className="mt-2 text-[#831670] ">Our friendly team is here to help.</p>
                <p className="mt-2 text-[#fb6f92] "><a href="mailto:mohair.handmade11@gmail.com">mohair.handmade11@gmail.com</a></p>
            </div>

        <div className="flex flex-col items-center justify-center text-center">
                <span className="p-3 text-[#831670] rounded-full bg-[#fee0f9] ">
                    <img src="/instagram.png" width={40} alt="icon" />
                </span>

                <h2 className="mt-4 text-lg font-medium text-[#831670] ">Instgram</h2>
                <p className="mt-2 text-[#831670] ">You are welcom any time</p>
                <p className="mt-2 text-[#fb6f92] "><a
                href='https://ig.me/m/mohair_handmadecrochet' target='_blank'>
                Click me to DM
              </a>
              </p>
            </div>

            <div className="flex flex-col items-center justify-center text-center">
                <span className="p-3 text-[#831670] rounded-full bg-[#fee0f9] ">
                    <img src="/whatsapp.png" width={40} alt="icon" />
                </span>
                
                <h2 className="mt-4 text-lg font-medium text-[#831670] ">Phone</h2>
                <p className="mt-2 text-[#831670] ">24-h</p>
                <p className="mt-2 text-[#fb6f92] ">
                    <a
                href="https://wa.me/201092753813"
                target="_blank"
                rel="noopener noreferrer"
              > (+20)1092753813</a>
                    </p>
            </div>
        </div>
    </div>
</section>
    </div>
  )
}
