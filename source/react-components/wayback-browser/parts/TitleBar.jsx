/*
 * 2019 Tarpeeksi Hyvae Soft
 *
 * Software: Serlain
 * 
 */

"use strict";

import {panic_if_not_type} from "../../../assert.js";

// The title bar of a WaybackBrowser.
export function TitleBar(props = {})
{
    TitleBar.validate_props(props);

    return <>

               <div className="TitleBar">

                   Serlain

               </div>

               <div className="dragger"></div>

           </>
}

TitleBar.validate_props = function(props = {})
{
    panic_if_not_type("object", props);

    return;
}
