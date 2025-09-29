import React from 'react';
import {
  Award,
  ShieldCheck,
  ClipboardList,
  Users,
  MapPin,
  Phone,
  Mail,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export default function AboutUs() {
  return (
    <div className="bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-blue-200 text-slate-900">
        {/* Decorative background */}
        <div className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute -top-24 -left-24 w-96 h-96 rounded-full bg-blue-100/50 blur-3xl" />
          <div className="absolute top-1/2 right-0 w-[32rem] h-[32rem] -translate-y-1/2 rounded-full bg-blue-100 blur-2xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_60%)]" />
        </div>

        <div className="relative max-w-[1380px] mx-auto px-4 py-16">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-700 via-blue-500 to-sky-400">LSSCTC</span>
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto leading-relaxed text-slate-600">
              Leading Safety Skills Crane Training Center - Your trusted partner in professional crane operator education and safety training.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-16">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">Our Mission</h2>
              <p className="text-lg text-slate-600 leading-relaxed mb-8">
                To provide world-class crane operator training that prioritizes safety, competency, and professional excellence. We are committed to developing skilled operators who contribute to safer worksites and more efficient operations.
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-r-lg">
                <h3 className="text-xl font-semibold text-blue-900 mb-3">Our Vision</h3>
                <p className="text-blue-800">
                  To be the premier crane training institution, recognized for our commitment to safety excellence and innovative training methodologies that set industry standards.
                </p>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=1470&auto=format&fit=crop" 
                alt="Crane training facility" 
                className="w-full h-96 object-cover rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Company History */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Story</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              Over two decades of excellence in crane operator training and safety education
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                20+
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Years of Experience</h3>
              <p className="text-slate-600">
                Established in 2003, we've been at the forefront of crane operator education, adapting to industry changes and technological advances.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                5K+
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Trained Operators</h3>
              <p className="text-slate-600">
                Over 5,000 certified crane operators have graduated from our programs, now working safely across various industries.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                98%
              </div>
              <h3 className="text-xl font-semibold text-slate-900 mb-2">Success Rate</h3>
              <p className="text-slate-600">
                Our comprehensive training approach results in a 98% pass rate for certification exams and excellent job placement rates.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Training Facilities */}
      <section className="py-16">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?q=80&w=1470&auto=format&fit=crop" 
                alt="Modern training facility" 
                className="w-full h-96 object-cover rounded-xl shadow-lg"
                loading="lazy"
              />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-6">State-of-the-Art Facilities</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Modern Crane Fleet</h4>
                    <p className="text-slate-600">Latest model cranes including mobile, tower, and overhead cranes for comprehensive hands-on training.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Advanced Simulators</h4>
                    <p className="text-slate-600">High-fidelity crane simulators providing safe learning environments for complex scenarios.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Dedicated Training Yards</h4>
                    <p className="text-slate-600">Purpose-built training areas simulating real-world construction and industrial environments.</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <h4 className="font-semibold text-slate-900">Classroom Technology</h4>
                    <p className="text-slate-600">Interactive learning spaces equipped with modern audiovisual technology and safety demonstration areas.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Certifications */}
      <section className="py-16 bg-slate-50">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Safety Standards & Certifications</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We maintain the highest safety standards and hold all necessary certifications to ensure quality training
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-md hover:shadow-blue-100 hover:border-blue-200 transition">
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-50 p-2">
                <Award className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">NCCCO Certified</h4>
              <p className="text-sm text-slate-600">National Commission for the Certification of Crane Operators accredited training provider</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-md hover:shadow-blue-100 hover:border-blue-200 transition">
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-50 p-2">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">OSHA Compliant</h4>
              <p className="text-sm text-slate-600">All training programs meet or exceed OSHA safety requirements and standards</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-md hover:shadow-blue-100 hover:border-blue-200 transition">
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-50 p-2">
                <ClipboardList className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">ISO 9001 Certified</h4>
              <p className="text-sm text-slate-600">Quality management system certification ensuring consistent training excellence</p>
            </div>

            <div className="bg-white p-6 rounded-xl border border-slate-200 text-center hover:shadow-md hover:shadow-blue-100 hover:border-blue-200 transition">
              <div className="mb-3 inline-flex items-center justify-center rounded-full bg-blue-50 p-2">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-slate-900 mb-2">Industry Partnerships</h4>
              <p className="text-sm text-slate-600">Partnerships with leading construction and industrial companies for real-world training</p>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership Team */}
      <section className="py-16">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Leadership Team</h2>
            <p className="text-lg text-slate-600">
              Experienced professionals leading our commitment to excellence
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=1470&auto=format&fit=crop" 
                alt="Director" 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                loading="lazy"
              />
              <h4 className="text-xl font-semibold text-slate-900">John Anderson</h4>
              <p className="text-blue-600 mb-2">Training Director</p>
              <p className="text-sm text-slate-600">25+ years in crane operations and safety training with extensive industry certifications.</p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1494790108755-2616c6c906cd?q=80&w=1470&auto=format&fit=crop" 
                alt="Safety Manager" 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                loading="lazy"
              />
              <h4 className="text-xl font-semibold text-slate-900">Sarah Chen</h4>
              <p className="text-blue-600 mb-2">Safety Manager</p>
              <p className="text-sm text-slate-600">Certified safety professional with expertise in OSHA regulations and risk management.</p>
            </div>

            <div className="text-center">
              <img 
                src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?q=80&w=1470&auto=format&fit=crop" 
                alt="Operations Manager" 
                className="w-32 h-32 rounded-full object-cover mx-auto mb-4"
                loading="lazy"
              />
              <h4 className="text-xl font-semibold text-slate-900">Michael Rodriguez</h4>
              <p className="text-blue-600 mb-2">Operations Manager</p>
              <p className="text-sm text-slate-600">Former construction supervisor with deep understanding of real-world crane operations.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact & Location */}
      <section className="py-16 bg-slate-100 text-slate-900">
        <div className="max-w-[1380px] mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold mb-6">Get in Touch</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Training Center Location</h4>
                    <p className="text-slate-600">123 Industrial Boulevard<br />Construction District, State 12345</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Phone</h4>
                    <p className="text-slate-600">(555) 123-CRANE (2726)</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Mail className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Email</h4>
                    <p className="text-slate-600">info@lssctc.com</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h4 className="font-semibold mb-1">Training Hours</h4>
                    <p className="text-slate-600">Monday - Friday: 7:00 AM - 6:00 PM<br />Saturday: 8:00 AM - 4:00 PM</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-2xl font-semibold mb-6">Ready to Start Your Training?</h3>
              <p className="text-slate-600 mb-6">
                Contact us today to learn more about our programs and take the first step towards becoming a certified crane operator.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="px-6 py-3 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium transition-colors shadow-sm shadow-blue-900/30">
                  Enroll Now
                </button>
                <button className="px-6 py-3 border border-slate-300 text-slate-700 hover:bg-slate-200 rounded-lg font-medium transition-colors">
                  Schedule Tour
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}