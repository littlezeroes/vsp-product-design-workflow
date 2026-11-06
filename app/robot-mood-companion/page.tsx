import type {Metadata} from 'next';
import {RobotMoodCompanion} from './RobotMoodCompanion';
export const metadata:Metadata={title:'Pip · Robot Mood Companion',description:'Six moods, one little desk companion. Adapted from Native Cook.'};
export default function RobotMoodCompanionPage(){return <RobotMoodCompanion autoPlay/>;}
