import $ from 'n-zepto'
import { dialogFunc } from './core.js';
import "../css/dialog.css";
export function dialog(){
   return dialogFunc($,window,document,undefined)
};
window.dialog=dialog($,window,document,undefined);