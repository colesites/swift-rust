'use client';
'use node';
import { useState } from "react";
export default function Widget(){ const [n]=useState(3); return <main data-widget>w{n}</main>; }
