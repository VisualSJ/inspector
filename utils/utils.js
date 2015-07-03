var buildNode = function ( node, clsList ) {
    var clsDef;

    if ( node.__type__ ) {
        clsDef = clsList[node.__type__];
    } else {
        Editor.warn('Can not find class define for type %s', node.__type__ );
    }

    if ( clsDef ) {
        for ( var k in node ) {
            if ( k === '__type__' ) {
                continue;
            }

            if ( k === '__mixins__' ) {
                var mixins = node[k];
                for ( var i = 0; i < mixins.length; ++i ) {
                    buildNode(mixins[i], clsList);
                }
                continue;
            }

            var val = node[k];
            var attrs;

            if ( clsDef.properties ) {
                attrs = clsDef.properties[k];
            }

            if ( val && typeof val === 'object' && clsDef.properties ) {
                buildNode( val, clsList );
            }

            node[k] = {
                name: EditorUI.toHumanText(k),
                attrs: attrs,
                value: val,
            };
        }
    }
};

var normalizePath = function ( path, trim ) {
    var list = path.split('.');
    if ( list[0] === trim )
        list.splice( 0, 1 );

    var result = [];
    for ( var i = 0; i < list.length; ++i ) {
        var name = list[i];
        if ( i%2 === 0 ) {
            result.push(name);
        }
    }
    return result.join('.');
};

module.exports = {
    buildNode: buildNode,
    normalizePath: normalizePath,
};

