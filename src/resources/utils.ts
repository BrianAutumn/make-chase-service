import * as mongoose from "mongoose";
import * as dbschemas from "../dao/DBSchemas";


export async function generate_base_map(game) {
    // TODO generate test map for us to validate everything is working
    const map = new dbschemas.Map({'type': 'test'});

    const node0 = new dbschemas.Node({'x_pos': 0, 'y_pos': 0, 'map': map});
    const node1 = new dbschemas.Node({'x_pos': 1, 'y_pos': 0, 'map': map});
    const node2 = new dbschemas.Node({'x_pos': 0, 'y_pos': 1, 'map': map});
    const node3 = new dbschemas.Node({'x_pos': 1, 'y_pos': 1, 'map': map});

    const path0 = new dbschemas.Path({'first_node': node0, 'second_node': node1, 'is_broken': false, 'map': map})
    const path1 = new dbschemas.Path({'first_node': node0, 'second_node': node2, 'is_broken': false, 'map': map})
    const path2 = new dbschemas.Path({'first_node': node0, 'second_node': node3, 'is_broken': false, 'map': map})
    const path3 = new dbschemas.Path({'first_node': node1, 'second_node': node2, 'is_broken': false, 'map': map})
    const path4 = new dbschemas.Path({'first_node': node1, 'second_node': node3, 'is_broken': false, 'map': map})
    const path5 = new dbschemas.Path({'first_node': node2, 'second_node': node3, 'is_broken': false, 'map': map})

    game.map = map;
    map.save();
    game.save();

    node0.save();
    node1.save();
    node2.save();
    node3.save();

    path0.save();
    path1.save();
    path2.save();
    path3.save();
    path4.save();
    path5.save();

    return null;
}

export async function process_actions(actions) {
    return null;
}
