import { Building, MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function Contact() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-secondary py-16 text-center border-b-4 border-accent relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_bottom_left,_var(--tw-gradient-stops))] from-primary to-transparent"></div>
        <h1 className="text-4xl md:text-5xl font-heading font-bold text-white mb-4 relative z-10">Get In Touch</h1>
        <p className="text-gray-300 max-w-2xl mx-auto text-lg px-4 relative z-10">
          We're here to assist you with all your accounting, tax, and compliance needs. Reach out to your nearest branch.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Pretoria Branch */}
          <Card className="border-t-4 border-t-primary shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-primary/10 p-3 rounded-xl text-primary">
                  <Building className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-secondary">Pretoria Branch</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">Address</h4>
                    <p className="text-gray-600">No 238 Justice Mahomed Street<br/>Brooklyn, Pretoria<br/>0181</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">Phone</h4>
                    <p className="text-gray-600">067 765 7387<br/>012 751 3200</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-accent mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">Email</h4>
                    <a href="mailto:admin@dithetoaccountants.co.za" className="text-primary hover:underline font-medium">admin@dithetoaccountants.co.za</a>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                <a href="https://wa.me/27677657387" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white">WhatsApp</Button>
                </a>
                <a href="tel:0677657387" className="flex-1">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">Call Now</Button>
                </a>
              </div>
            </CardContent>
          </Card>

          {/* Secunda Branch */}
          <Card className="border-t-4 border-t-accent shadow-lg hover:shadow-xl transition-shadow">
            <CardContent className="p-8">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-accent/10 p-3 rounded-xl text-accent">
                  <Building className="h-8 w-8" />
                </div>
                <h2 className="text-2xl font-heading font-bold text-secondary">Secunda Branch</h2>
              </div>
              
              <div className="space-y-6">
                <div className="flex items-start gap-4">
                  <MapPin className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">Address</h4>
                    <p className="text-gray-600">Shop No 25 Sanlam Plaza<br/>Horwood Street, Secunda<br/>2302</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Phone className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">Phone</h4>
                    <p className="text-gray-600">071 478 1810<br/>017 631 1890</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4">
                  <Mail className="h-5 w-5 text-primary mt-1 shrink-0" />
                  <div>
                    <h4 className="font-semibold text-secondary mb-1">Email</h4>
                    <a href="mailto:secunda@dithetoaccountants.co.za" className="text-primary hover:underline font-medium">secunda@dithetoaccountants.co.za</a>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-gray-100 flex gap-4">
                <a href="https://wa.me/27714781810" target="_blank" rel="noopener noreferrer" className="flex-1">
                  <Button className="w-full bg-[#25D366] hover:bg-[#20bd5a] text-white">WhatsApp</Button>
                </a>
                <a href="tel:0714781810" className="flex-1">
                  <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/5">Call Now</Button>
                </a>
              </div>
            </CardContent>
          </Card>
          
        </div>
      </div>
    </div>
  );
}
