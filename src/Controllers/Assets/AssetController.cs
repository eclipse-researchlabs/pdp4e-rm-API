using Core.Assets.Implementation.Commands;
using Core.Assets.Implementation.Commands.Assets;
using Core.Assets.Implementation.Commands.Edges;
using Core.Assets.Interfaces.Services;
using Core.AuditTrail.Interfaces.Services;
using Core.AuditTrail.Models;
using Core.Database.Enums;
using Core.Database.Models;
using Core.Database.Tables;
using Core.Relationships.Implementation.Commands;
using Core.Relationships.Interfaces.Services;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using System;
using System.Linq;
using System.Threading.Tasks;

namespace Core.Api.Controllers.Assets
{
    [Route("api/assets"), ApiController, EnableCors("CorsRules")]
    public class AssetsController : Components.Controllers.Assets.AssetsController
    {
        public AssetsController(IAssetService assetService, IRelationshipService relationshipService, IAuditTrailService auditTrailService) : base(assetService, relationshipService, auditTrailService)
        {
        }

        [HttpPost, ProducesResponseType(201)]
        public new IActionResult Create([FromBody] CreateAssetCommand command) => Ok(base.Create(command));

        [HttpPost("link"), ProducesResponseType(201)]
        public new IActionResult LinkAssetToContainer([FromBody] LinkAssetToContainerCommand command) =>
            Ok(base.LinkAssetToContainer(command));

        [HttpPut("position"), ProducesResponseType(200)]
        public new IActionResult MovePosition([FromBody] UpdateAssetPositionCommand command) =>
            Ok(base.MovePosition(command));

        [HttpPut("name"), ProducesResponseType(200)]
        public new IActionResult UpdateName([FromBody] ChangeAssetNameCommand command) => Ok(base.UpdateName(command));

        [HttpPut("dfdQuestionaire"), ProducesResponseType(200)]
        public new IActionResult UpdateDfdQuestionaire([FromBody] UpdateDfdQuestionaireCommand command) => Ok(base.UpdateDfdQuestionaire(command));

        [HttpDelete("{ids}"), ProducesResponseType(201)]
        public new IActionResult DeleteAsset(string ids) => Ok(base.DeleteAsset(ids));
    }
}