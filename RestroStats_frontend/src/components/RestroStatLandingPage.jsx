import { useState } from 'react';
import {
    BarChart, PieChart, LineChart, Laptop,
    ChefHat, TrendingUp, DollarSign, Users, Star,
    ChevronRight, Menu, X
} from 'lucide-react';
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function RestroStatLandingPage() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
            {/* Navigation */}
            <nav className="bg-white shadow-sm">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex items-center">
                            <span className="text-2xl font-bold text-blue-600">RestroStat</span>
                        </div>

                        {/* Desktop Navigation */}
                        <div className="hidden md:flex items-center space-x-8">
                            <a href="#features" className="text-gray-700 hover:text-blue-600">Features</a>
                            <a href="#benefits" className="text-gray-700 hover:text-blue-600">Benefits</a>
                            <a href="#testimonials" className="text-gray-700 hover:text-blue-600">Testimonials</a>
                            <a href="#pricing" className="text-gray-700 hover:text-blue-600">Pricing</a>
                            <Link to='/login'>
                                <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 cursor-pointer">
                                    Get Started
                                </button>
                            </Link>
                        </div>

                        {/* Mobile menu button */}
                        <div className="md:hidden flex items-center">
                            <button
                                onClick={() => setIsMenuOpen(!isMenuOpen)}
                                className="text-gray-600 hover:text-blue-600"
                            >
                                {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Navigation */}
                {isMenuOpen && (
                    <div className="md:hidden">
                        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
                            <a href="#features" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Features</a>
                            <a href="#benefits" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Benefits</a>
                            <a href="#testimonials" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Testimonials</a>
                            <a href="#pricing" className="block px-3 py-2 text-gray-700 hover:text-blue-600">Pricing</a>
                            <Link to='/login'>
                                <button className="mt-2 w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                                    Get Started
                                </button>
                            </Link>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <div className="relative bg-white overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
                        <div className="pt-10 mx-auto max-w-7xl px-4 sm:pt-12 sm:px-6 md:pt-16 lg:pt-20 lg:px-8 xl:pt-28">
                            <div className="sm:text-center lg:text-left">
                                <h1 className="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                                    <span className="block">Data-Driven Decisions</span>
                                    <span className="block text-blue-600">for Restaurants</span>
                                </h1>
                                <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                                    RestroStat helps restaurant owners transform raw data into actionable insights.
                                    Boost revenue, optimize operations, and grow your business with powerful analytics.
                                </p>
                                <div className="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start">
                                    <div className="rounded-md shadow">
                                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10">
                                            Request Demo
                                        </button>
                                    </div>
                                    <div className="mt-3 sm:mt-0 sm:ml-3">
                                        <button className="w-full flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-blue-700 bg-blue-100 hover:bg-blue-200 md:py-4 md:text-lg md:px-10">
                                            Learn More
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="lg:absolute lg:inset-y-0 lg:right-0 lg:w-1/2 bg-blue-50 flex items-center justify-center p-8">
                    <div className="relative h-64 w-full md:h-72 lg:h-96 rounded-xl shadow-xl overflow-hidden bg-white p-4">
                        <div className="flex flex-col h-full">
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-medium">Sales Dashboard</h3>
                                <div className="flex space-x-2">
                                    <div className="h-3 w-3 rounded-full bg-red-400"></div>
                                    <div className="h-3 w-3 rounded-full bg-yellow-400"></div>
                                    <div className="h-3 w-3 rounded-full bg-green-400"></div>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4 mb-4">
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="text-sm text-gray-500">Total Revenue</div>
                                    <div className="text-xl font-bold">$12,345</div>
                                    <div className="text-xs text-green-600">↑ 12% vs last month</div>
                                </div>
                                <div className="bg-blue-50 p-3 rounded-lg">
                                    <div className="text-sm text-gray-500">Avg Order Value</div>
                                    <div className="text-xl font-bold">$42.50</div>
                                    <div className="text-xs text-green-600">↑ 5% vs last month</div>
                                </div>
                            </div>
                            <div className="flex-1 bg-gray-100 rounded-lg flex justify-center items-center">
                                <div className="text-gray-500 flex flex-col items-center">
                                    <BarChart className="h-12 w-12 text-blue-500" />
                                    <LineChart className="h-12 w-12 text-green-500" />
                                    <PieChart className="h-12 w-12 text-purple-500" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Features Section */}
            <section id="features" className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Features</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Everything you need to succeed
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            RestroStat provides a comprehensive suite of tools to help you optimize your restaurant operations.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-md text-blue-600">
                                    <TrendingUp size={24} />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Sales Analytics</h3>
                                <p className="mt-2 text-gray-600">
                                    Track sales performance across different timeframes, menu items, and more with detailed visualizations.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-md text-blue-600">
                                    <ChefHat size={24} />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Menu Optimization</h3>
                                <p className="mt-2 text-gray-600">
                                    Identify your most profitable dishes and optimize your menu for maximum revenue.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-md text-blue-600">
                                    <DollarSign size={24} />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Cost Management</h3>
                                <p className="mt-2 text-gray-600">
                                    Track and optimize your food costs, labor costs, and other expenses to maximize profitability.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-md text-blue-600">
                                    <Users size={24} />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Customer Insights</h3>
                                <p className="mt-2 text-gray-600">
                                    Understand your customers better with detailed demographics, preferences, and feedback analysis.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-md text-blue-600">
                                    <Laptop size={24} />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Inventory Management</h3>
                                <p className="mt-2 text-gray-600">
                                    Track inventory levels, reduce waste, and optimize your purchasing with intelligent forecasting.
                                </p>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
                                <div className="inline-flex items-center justify-center p-2 bg-blue-100 rounded-md text-blue-600">
                                    <Star size={24} />
                                </div>
                                <h3 className="mt-4 text-lg font-medium text-gray-900">Review Analysis</h3>
                                <p className="mt-2 text-gray-600">
                                    Automatically analyze customer reviews to identify strengths and areas for improvement.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section id="benefits" className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Benefits</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Why choose RestroStat?
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Our restaurant analytics platform delivers real value to your business.
                        </p>
                    </div>

                    <div className="mt-10">
                        <div className="space-y-10 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-8 md:gap-y-10">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                        <TrendingUp size={24} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Increased Revenue</h3>
                                    <p className="mt-2 text-gray-600">
                                        RestroStat users report an average 15% increase in revenue within the first 6 months.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                        <DollarSign size={24} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Cost Reduction</h3>
                                    <p className="mt-2 text-gray-600">
                                        Identify inefficiencies and reduce operational costs by up to 20%.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                        <ChefHat size={24} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Menu Optimization</h3>
                                    <p className="mt-2 text-gray-600">
                                        Data-driven menu design that maximizes profitability and customer satisfaction.
                                    </p>
                                </div>
                            </div>

                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-blue-500 text-white">
                                        <Users size={24} />
                                    </div>
                                </div>
                                <div className="ml-4">
                                    <h3 className="text-lg font-medium text-gray-900">Better Customer Experience</h3>
                                    <p className="mt-2 text-gray-600">
                                        Use data to understand and meet customer expectations, leading to higher satisfaction and loyalty.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-12 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-extrabold text-center text-gray-900">
                        Trusted by restaurants nationwide
                    </h2>
                    <div className="mt-10">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="text-yellow-400 flex">
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "RestroStat has transformed how we run our business. The insights we've gained have helped us increase our profit margin by 22% in just three months."
                                </p>
                                <div className="mt-4">
                                    <h4 className="font-medium">Sarah Johnson</h4>
                                    <p className="text-sm text-gray-500">Owner, The Olive Branch</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="text-yellow-400 flex">
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "The menu optimization tool alone has paid for our subscription ten times over. We've eliminated underperforming dishes and focused on what customers really want."
                                </p>
                                <div className="mt-4">
                                    <h4 className="font-medium">Michael Chen</h4>
                                    <p className="text-sm text-gray-500">Executive Chef, Fusion Bites</p>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg shadow-sm">
                                <div className="flex items-center mb-4">
                                    <div className="text-yellow-400 flex">
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                        <Star size={20} fill="currentColor" />
                                    </div>
                                </div>
                                <p className="text-gray-600 italic">
                                    "As a restaurant group with multiple locations, RestroStat gives us the centralized data we need to make informed decisions across our entire operation."
                                </p>
                                <div className="mt-4">
                                    <h4 className="font-medium">David Williams</h4>
                                    <p className="text-sm text-gray-500">Director, Urban Plate Group</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            {/* <section id="pricing" className="py-12 bg-gray-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:text-center">
                        <h2 className="text-base text-blue-600 font-semibold tracking-wide uppercase">Pricing</h2>
                        <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                            Simple, transparent pricing
                        </p>
                        <p className="mt-4 max-w-2xl text-xl text-gray-500 lg:mx-auto">
                            Choose the plan that fits your restaurant's needs.
                        </p>
                    </div>

                    <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Starter</h3>
                            <p className="mt-4 text-gray-600">Perfect for small restaurants and cafes.</p>
                            <p className="mt-8">
                                <span className="text-4xl font-extrabold text-gray-900">$99</span>
                                <span className="text-gray-500">/month</span>
                            </p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Basic sales analytics</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Menu performance tracking</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Up to 1,000 orders/month</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Email support</p>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Get Started
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-md border-2 border-blue-500 relative">
                            <div className="absolute top-0 inset-x-0 transform -translate-y-1/2">
                                <div className="inline-block bg-blue-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                                    Most Popular
                                </div>
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">Professional</h3>
                            <p className="mt-4 text-gray-600">For growing restaurants with multiple staff members.</p>
                            <p className="mt-8">
                                <span className="text-4xl font-extrabold text-gray-900">$199</span>
                                <span className="text-gray-500">/month</span>
                            </p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Advanced analytics dashboard</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Customer behavior insights</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Inventory management</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Up to 5,000 orders/month</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Priority support</p>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Get Started
                                </button>
                            </div>
                        </div>

                        <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-200">
                            <h3 className="text-lg font-medium text-gray-900">Enterprise</h3>
                            <p className="mt-4 text-gray-600">For restaurant groups and chains with multiple locations.</p>
                            <p className="mt-8">
                                <span className="text-4xl font-extrabold text-gray-900">$399</span>
                                <span className="text-gray-500">/month</span>
                            </p>
                            <ul className="mt-6 space-y-4">
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Everything in Professional</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Multi-location analytics</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Custom reporting</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">Unlimited orders</p>
                                </li>
                                <li className="flex items-start">
                                    <div className="flex-shrink-0">
                                        <ChevronRight size={20} className="text-green-500" />
                                    </div>
                                    <p className="ml-3 text-gray-600">24/7 dedicated support</p>
                                </li>
                            </ul>
                            <div className="mt-8">
                                <button className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700">
                                    Contact Sales
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}

            {/* CTA Section */}
            <section className="py-12 bg-blue-600">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="lg:flex lg:items-center lg:justify-between">
                        <h2 className="text-3xl font-extrabold tracking-tight text-white sm:text-4xl">
                            <span className="block">Ready to transform your restaurant?</span>
                            <span className="block text-blue-200">Start today.</span>
                        </h2>
                        <div className="mt-8 flex lg:mt-0 lg:flex-shrink-0">
                            <div className="inline-flex rounded-md shadow">
                                <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-blue-600 bg-white hover:bg-blue-50">
                                    Get Started
                                </button>
                            </div>
                            <div className="ml-3 inline-flex rounded-md shadow">
                                <button className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-800 hover:bg-blue-700">
                                    Schedule Demo
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <footer className="bg-gray-800">
                <div className="max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                        <div>
                            <h3 className="text-xl font-bold text-white">RestroStat</h3>
                            <p className="mt-2 text-gray-300">
                                Making restaurant analytics simple and powerful.
                            </p>
                            <div className="mt-4 flex space-x-6">
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <Facebook size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <Twitter size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <Instagram size={20} />
                                </a>
                                <a href="#" className="text-gray-400 hover:text-white">
                                    <Linkedin size={20} />
                                </a>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Product</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#features" className="text-base text-gray-400 hover:text-white">Features</a></li>
                                <li><a href="#pricing" className="text-base text-gray-400 hover:text-white">Pricing</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white">Integrations</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white">API</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Support</h3>
                            <ul className="mt-4 space-y-4">
                                <li><a href="#" className="text-base text-gray-400 hover:text-white">Documentation</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white">Guides</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white">Help Center</a></li>
                                <li><a href="#" className="text-base text-gray-400 hover:text-white">Contact Support</a></li>
                            </ul>
                        </div>

                        <div>
                            <h3 className="text-sm font-semibold text-gray-300 uppercase tracking-wider">Contact</h3>
                            <ul className="mt-4 space-y-4">
                                <li>
                                    <a href="#" className="flex text-base text-gray-400 hover:text-white">
                                        <MapPin className="h-5 w-5 mr-2" />
                                        <span>123 Restaurant Row, Foodie City, FC 12345</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="tel:+15551234567" className="flex text-base text-gray-400 hover:text-white">
                                        <Phone className="h-5 w-5 mr-2" />
                                        <span>+91 1234567 (555/554)</span>
                                    </a>
                                </li>
                                <li>
                                    <a href="mailto:info@restrostat.com" className="flex text-base text-gray-400 hover:text-white">
                                        <Mail className="h-5 w-5 mr-2" />
                                        <span>info@restrostat.com</span>
                                    </a>
                                </li>
                            </ul>
                        </div>
                    </div>

                    <div className="mt-8 pt-8 border-t border-gray-700">
                        <div className="md:flex md:items-center md:justify-between">
                            <div>
                                <p className="text-base text-gray-400">
                                    &copy; {new Date().getFullYear()} RestroStat, Inc. All rights reserved.
                                </p>
                            </div>
                            <div className="mt-4 md:mt-0">
                                <ul className="flex space-x-6">
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Privacy Policy</a></li>
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Terms of Service</a></li>
                                    <li><a href="#" className="text-sm text-gray-400 hover:text-white">Cookie Policy</a></li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    )
}