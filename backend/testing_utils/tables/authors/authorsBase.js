const authorsBase = {
    identifier: "authors",
    data: [
        {
            "first_name": "sarah",
            "last_name": "flores",
            "biography": "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis bibendum, odio id tristique luctus, lacus leo iaculis tellus, non venenatis enim massa euismod justo. Donec quis luctus risus. Pellentesque consectetur nisl ut scelerisque varius. Sed justo neque, mattis nec nibh non, vulputate hendrerit tellus. Fusce elementum consequat sem, nec ullamcorper dui mollis vitae. Pellentesque porttitor venenatis orci sit amet blandit. Duis sed dapibus orci, nec iaculis nisi. Aenean non sagittis elit. Sed sollicitudin eu ipsum vitae sodales. Integer interdum turpis ex, in vehicula magna consequat auctor. Phasellus vel lectus eget felis iaculis varius in eget velit. Donec ut urna varius, porta turpis ut, interdum massa. Sed non urna iaculis, ultrices ligula id, ultricies lacus. Proin semper efficitur nulla nec egestas. Curabitur a risus sed tortor consectetur aliquam."
        },
        {
            "first_name": "mateo",
            "last_name": "baker",
            "biography": "Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia curae; Suspendisse luctus luctus metus et eleifend. Donec pharetra sem congue elementum venenatis. Nulla vitae odio urna. Ut sit amet eros orci. Praesent dictum ac dui a efficitur. Ut non hendrerit velit, nec mattis dolor. Ut venenatis elit quam, eget pulvinar augue finibus sed. Proin mi magna, venenatis eu sagittis vel, porttitor vel velit. Pellentesque nisl lacus, aliquam quis turpis ac, congue mollis arcu. Suspendisse eu nunc consequat, tincidunt diam eget, ornare diam. Curabitur iaculis vitae erat in eleifend."
        },
        {
            "first_name": "sebastian",
            "last_name": "howard",
            "biography": "In semper urna sem, sagittis rutrum magna volutpat in. Vestibulum hendrerit vulputate euismod. Suspendisse ante erat, viverra et dui euismod, semper rhoncus neque. Aenean nulla neque, tempus condimentum faucibus a, dignissim eget magna. Proin ut imperdiet leo, commodo ultricies velit. Sed tempor ipsum eget enim convallis accumsan. Sed a tortor sit amet magna mollis porttitor non eget mauris. Fusce imperdiet augue id tellus laoreet, ac blandit ante ullamcorper. Quisque id varius risus. Sed ullamcorper id ligula at placerat."
        },
        {
            "first_name": "christina",
            "last_name": "lewis",
            "biography": "Nullam sollicitudin arcu eu dui facilisis, at tempor turpis scelerisque. Suspendisse faucibus volutpat lacus quis auctor. Praesent scelerisque nisl enim, a sodales elit aliquet ac. Sed viverra, eros quis varius cursus, sapien est aliquet metus, id malesuada orci felis vel risus. Praesent mattis, turpis et blandit sollicitudin, arcu nisl efficitur est, at imperdiet ante magna sit amet metus. Pellentesque faucibus quam fermentum, viverra est a, pellentesque tellus. Morbi sed mauris tellus. Suspendisse potenti. Nullam sit amet augue vitae orci tempus rhoncus."
        },
        {
            "first_name": "charles",
            "last_name": "simmons",
            "biography": "Curabitur fringilla lacus ac lacus dignissim condimentum mollis in est. Aliquam consectetur, nulla et accumsan eleifend, erat tellus cursus nulla, at faucibus libero lacus nec ante. Aliquam et ex at lorem ornare mollis. In hac habitasse platea dictumst. Aenean pretium viverra eros, at mattis libero. Proin vel dui et ex interdum dapibus. Etiam sit amet porta diam, at interdum enim. Vivamus in est et elit dignissim dignissim. Nam augue augue, pharetra non sagittis in, convallis vitae lectus. Curabitur vulputate massa nec elit feugiat volutpat. Integer accumsan rutrum risus vel dictum. Pellentesque ornare ipsum sed bibendum mollis. Cras enim elit, dignissim eget enim vel, sagittis rutrum purus. Nulla ut laoreet massa, pretium tincidunt quam."
        },
        {
            "first_name": "sara",
            "last_name": "baker",
            "biography": "Fusce at nunc lacinia, bibendum neque in, pharetra elit. Fusce orci justo, elementum vel mi sit amet, ultrices tempor eros. Ut placerat massa et velit tempor, id congue urna mollis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam dignissim neque non mattis blandit. Integer eget placerat erat. Donec tempor lorem ipsum, sed imperdiet sem rhoncus vel. Nullam nulla ligula, malesuada quis enim vel, ultrices dapibus mauris. In et justo non elit molestie dapibus sed eu velit. Donec semper, orci ut cursus egestas, nibh urna fringilla tortor, a blandit tellus libero vitae massa. Suspendisse fermentum ex vel volutpat luctus. Etiam ut venenatis leo."
        },
        {
            "first_name": "aiden",
            "last_name": "gray",
            "biography": "Sed nec dictum sem. Pellentesque dictum ante ac quam lobortis placerat. Suspendisse consectetur, sapien consectetur ornare venenatis, ante quam mollis lorem, a vehicula est enim sed quam. Etiam volutpat lacus diam, in elementum erat pharetra eget. Pellentesque lacus nisi, dapibus non volutpat non, lacinia nec nulla. Fusce eget purus suscipit, sagittis lacus sed, posuere mauris. Vivamus porttitor elementum iaculis. Nam id iaculis erat. Maecenas sit amet leo a magna aliquam suscipit id ut dolor. Cras vulputate nisl a scelerisque bibendum. In condimentum viverra congue. Fusce vitae ex vitae dolor venenatis aliquet. Vivamus id blandit lectus, eget vehicula nulla. Quisque laoreet ullamcorper consequat. Donec vitae risus vel lacus eleifend scelerisque."
        },
        {
            "first_name": "patrick",
            "last_name": "adams",
            "biography": "Vivamus eu lacus magna. Fusce sollicitudin maximus ante sed semper. Nulla facilisi. Suspendisse ultricies mi eget nisi vehicula, at aliquam nunc interdum. Nulla neque tellus, ultrices non consequat vitae, vehicula vulputate orci. Vivamus iaculis urna non enim maximus condimentum. Aliquam porttitor egestas viverra. Suspendisse elementum magna mauris, vitae vestibulum orci porttitor quis. Interdum et malesuada fames ac ante ipsum primis in faucibus. Pellentesque vehicula efficitur libero. In bibendum scelerisque lectus, sed vulputate diam gravida nec. Nulla congue bibendum velit dictum pulvinar. Cras pharetra libero a tempor tincidunt. Mauris eget ullamcorper nibh."
        }
    ]
};

module.exports = authorsBase;