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
    game.hider.node = node0;
    game.seeker.node = node3;
    await map.save();
    await game.save();

    await node0.save();
    await node1.save();
    await node2.save();
    await node3.save();

    await path0.save();
    await path1.save();
    await path2.save();
    await path3.save();
    await path4.save();
    await path5.save();
}

export async function process_actions(game, actions) {

    for (var idx = 0; idx < actions.length; idx++) {
        const current_action = actions[idx];
        await process_action(game, current_action);
    }

    return null;
}

export async function process_action(game, action) {
    if (action.type == 'move') {
        if(!action.player.node) {throw `Player (${action.player.role}) has not been placed on the map yet.`}
        const target_node_id = action.options;
        const target_node = await dbschemas.Node.findById(target_node_id);

        if(action.player.node == target_node) {throw "Player attempting to move to node they are currently on."}

        const map_paths = await dbschemas.Path.find({'map': game.map, 'broken': false});
        // const num_paths_connecting = dbschemas.Path.find({'map': game.map, 'first_node': action.player.node, 'second_node': target_node, 'broken': false}).count() + 
        //         dbschemas.Path.find({'map': game.map, 'first_node': action.player.node, 'second_node': target_node, 'broken': false}).count();

        var path_count = 0;
        await map_paths.countDocuments({'first_node': action.player.node, 'second_node': target_node}, function (err, count) {
            path_count += count;
        });
        await map_paths.countDocuments({'first_node': target_node, 'second_node': action.player.node}, function (err, count) {
            path_count += count;
        });
        if (path_count == 0) {throw "Attempted move: No unbroken path connects player to the destination node."}

    }
    else if (action.type == 'burn') {
        if (action.player != game.seeker) {throw "Only seeker can burn a path."}
        const node_id = action.options;
    }
}
