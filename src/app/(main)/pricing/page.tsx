'use client';

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Star } from "lucide-react";
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const freeFeatures = [
    "AI-Powered Symptom Diagnosis",
    "AI-Powered Image Diagnosis",
    "Nearby Health Center Locator",
    "AI Health Chatbot",
    "Health Report History"
];

const proFeatures = [
    "All features from the Free Plan",
    "Free consultancy everytime",
    "Enhanced AI Suggestions",
    "Personalized 1-to-1 meeting with doctors",
    "Offline Medicine Delivery",
    "Unlimited chatting with your expert"
];

export default function PricingPage() {
    return (
        <div className="flex flex-col gap-8">
            <div className="text-center">
                <h1 className="text-3xl font-bold tracking-tight">Our Pricing Plans</h1>
                <p className="text-muted-foreground">Choose the plan that's right for you. Simple and transparent.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-2 items-stretch">
                {/* Free Plan Card */}
                <Card className="glass-card flex flex-col h-full">
                    <CardHeader>
                        <CardTitle>Free Plan</CardTitle>
                        <CardDescription>Get started with our core AI health tools, completely free.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <p className="text-4xl font-bold">₹0</p>
                        <ul className="space-y-2">
                           {freeFeatures.map(feat => (
                                <li key={feat} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span className="text-muted-foreground">{feat}</span>
                                </li>
                           ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                         <Button className="w-full" variant="outline" disabled>Currently Active</Button>
                    </CardFooter>
                </Card>

                {/* Pro Plan Card */}
                <Card className="glass-card flex flex-col h-full border-primary/50 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-2 bg-primary text-primary-foreground rounded-bl-lg text-xs font-bold">
                        MOST POPULAR
                    </div>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2"><Star className="text-yellow-400 fill-yellow-400" /> Pro Plan</CardTitle>
                        <CardDescription>Unlock premium features for comprehensive health management.</CardDescription>
                    </CardHeader>
                    <CardContent className="flex-grow space-y-4">
                        <Tabs defaultValue="monthly" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                                <TabsTrigger value="monthly">Monthly</TabsTrigger>
                                <TabsTrigger value="yearly">Yearly (Save 33%)</TabsTrigger>
                            </TabsList>
                            <TabsContent value="monthly" className="text-center pt-4">
                                <p className="text-5xl font-bold">₹500<span className="text-lg font-normal text-muted-foreground">/month</span></p>
                            </TabsContent>
                            <TabsContent value="yearly" className="text-center pt-4">
                                <p className="text-5xl font-bold">₹4000<span className="text-lg font-normal text-muted-foreground">/year</span></p>
                            </TabsContent>
                        </Tabs>

                        <ul className="space-y-2 pt-4">
                           {proFeatures.map(feat => (
                                <li key={feat} className="flex items-center gap-2">
                                    <CheckCircle2 className="h-5 w-5 text-primary" />
                                    <span className="text-muted-foreground">{feat}</span>
                                </li>
                           ))}
                        </ul>
                    </CardContent>
                    <CardFooter>
                        <Button className="w-full" size="lg">
                            Upgrade to Pro
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </div>
    );
}
